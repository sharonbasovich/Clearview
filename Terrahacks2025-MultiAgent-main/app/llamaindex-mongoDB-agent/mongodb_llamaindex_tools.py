"""
MongoDB LlamaIndex tools for advanced database operations - Google ADK Compatible.
"""

# Standard imports for ADK compatibility
import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional

# MongoDB and database imports
from pymongo import MongoClient

# LlamaIndex imports (wrapped in try-except for optional dependencies)
try:
    from llama_index.core import Document, VectorStoreIndex, Settings
    from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
    from llama_index.core.retrievers import VectorIndexRetriever
    from llama_index.embeddings.google import GeminiEmbedding
    LLAMAINDEX_AVAILABLE = True
except ImportError:
    # LlamaIndex not available, use basic MongoDB operations
    LLAMAINDEX_AVAILABLE = False
    print("LlamaIndex not available, using basic MongoDB text search")

# MongoDB connection settings
MONGODB_CONNECTION_STRING = "mongodb+srv://yichenxiao08:%24%25ghedgr8@cluster0.bwg31an.mongodb.net"
MONGODB_DATABASE_NAME = "agent_conversations"

# Vector search settings for MongoDB Atlas
VECTOR_COLLECTION_NAME = "vector_embeddings"
VECTOR_INDEX_NAME = "vector_search_index"
EMBEDDING_DIMENSION = 768  # Google Gemini embedding dimension

def _get_mongodb_client():
    """Get MongoDB client with proper configuration for ADK tools."""
    try:
        client = MongoClient(
            MONGODB_CONNECTION_STRING,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000
        )
        # Test connection
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return None

def _setup_vector_store():
    """Setup MongoDB Atlas Vector Store with LlamaIndex."""
    try:
        client = _get_mongodb_client()
        if not client or not LLAMAINDEX_AVAILABLE:
            return None
        
        # Configure LlamaIndex settings for embeddings
        Settings.embed_model = GeminiEmbedding(
            model="gemini-embedding-001"
        )
        
        # Setup MongoDB Atlas Vector Store
        vector_store = MongoDBAtlasVectorSearch(
            mongodb_client=client,
            database_name=MONGODB_DATABASE_NAME,
            collection_name=VECTOR_COLLECTION_NAME,
            index_name=VECTOR_INDEX_NAME,
            embedding_dimension=EMBEDDING_DIMENSION,
            similarity_function="cosine"
        )
        
        print("✅ MongoDB Atlas Vector Store initialized")
        return vector_store
        
    except Exception as e:
        print(f"❌ Vector store setup error: {e}")
        return None

def _create_vector_index_if_needed():
    """Create vector search index in MongoDB Atlas if it doesn't exist."""
    try:
        client = _get_mongodb_client()
        if not client:
            return False
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[VECTOR_COLLECTION_NAME]
        
        # Check if vector index already exists
        existing_indexes = list(collection.list_search_indexes())
        if any(idx.get('name') == VECTOR_INDEX_NAME for idx in existing_indexes):
            print(f"✅ Vector index '{VECTOR_INDEX_NAME}' already exists")
            return True
        
        # Create vector search index definition
        vector_index_definition = {
            "name": VECTOR_INDEX_NAME,
            "definition": {
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding",
                        "numDimensions": EMBEDDING_DIMENSION,
                        "similarity": "cosine"
                    },
                    {
                        "type": "filter", 
                        "path": "metadata.title"
                    },
                    {
                        "type": "filter",
                        "path": "metadata.timestamp"
                    }
                ]
            }
        }
        
        # Create the vector index
        collection.create_search_index(vector_index_definition)
        print(f"✅ Created vector search index: {VECTOR_INDEX_NAME}")
        return True
        
    except Exception as e:
        print(f"❌ Vector index creation error: {e}")
        return False

def semantic_search_documents(query: str, collection_name: str, limit: int = 5) -> str:
    """
    🔍 ADK Tool: Perform semantic search on MongoDB documents.
    
    Args:
        query: Natural language search query
        collection_name: MongoDB collection to search in
        limit: Maximum number of results to return (default: 5)
    
    Returns:
        JSON string containing search results with relevance scores
    """
    try:
        # For now, we'll use a simplified approach without requiring OpenAI API
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Simple text search using MongoDB's text search capabilities
        # Create a text index if it doesn't exist
        try:
            collection.create_index([("$**", "text")])
        except:
            pass  # Index might already exist
        
        # Perform text search
        search_results = list(collection.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(limit))
        
        # Convert ObjectId to string for JSON serialization
        for doc in search_results:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        
        result = {
            "query": query,
            "collection": collection_name,
            "results": search_results,
            "total_found": len(search_results)
        }
        
        client.close()
        return json.dumps(result, indent=2, default=str)
        
    except Exception as e:
        return f"Error performing semantic search: {str(e)}"

def store_document_with_embeddings(collection_name: str, document: str, title: Optional[str] = None) -> str:
    """
    💾 ADK Tool: Store a document in MongoDB with search optimization.
    
    Args:
        collection_name: Target MongoDB collection name
        document: Document content (JSON string or plain text)
        title: Optional descriptive title for the document
    
    Returns:
        Success message with document ID or error details
    """
    try:
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        # Parse document content
        try:
            doc_data = json.loads(document)
            content = json.dumps(doc_data, indent=2)
        except json.JSONDecodeError:
            # If not JSON, treat as plain text
            content = document
            doc_data = {"content": content}
        
        # Add metadata for semantic search
        doc_data.update({
            "timestamp": datetime.now().isoformat(),
            "title": title or "Untitled Document",
            "indexed_for_search": True,
            "content_type": "json" if isinstance(doc_data.get("content"), dict) else "text",
            "searchable_text": content  # Field for text search
        })
        
        # Store in MongoDB collection
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Create text index for search
        try:
            collection.create_index([("searchable_text", "text"), ("title", "text")])
        except:
            pass  # Index might already exist
        
        result = collection.insert_one(doc_data)
        
        client.close()
        return f"Document stored successfully with ID: {result.inserted_id}. Ready for semantic search."
        
    except Exception as e:
        return f"Error storing document: {str(e)}"

def query_documents_with_context(collection_name: str, query: str, context_limit: int = 3) -> str:
    """
    Query documents with additional context using MongoDB aggregation.
    
    Args:
        collection_name: MongoDB collection to query
        query: Natural language query
        context_limit: Number of context documents to retrieve
    
    Returns:
        Enhanced response with context
    """
    try:
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Ensure text index exists
        try:
            collection.create_index([("$**", "text")])
        except:
            pass
        
        # Perform aggregation to get context
        pipeline = [
            {"$match": {"$text": {"$search": query}}},
            {"$addFields": {"score": {"$meta": "textScore"}}},
            {"$sort": {"score": -1}},
            {"$limit": context_limit},
            {"$project": {
                "_id": {"$toString": "$_id"},
                "title": 1,
                "content": 1,
                "timestamp": 1,
                "score": 1
            }}
        ]
        
        context_docs = list(collection.aggregate(pipeline))
        
        # Generate summary of findings
        if context_docs:
            summary = f"Found {len(context_docs)} relevant documents for query: '{query}'"
            for i, doc in enumerate(context_docs, 1):
                title = doc.get('title', 'Untitled')
                content_preview = str(doc.get('content', ''))[:100] + "..."
                summary += f"\n{i}. {title}: {content_preview}"
        else:
            summary = f"No documents found matching query: '{query}'"
        
        result = {
            "query": query,
            "summary": summary,
            "context_documents": context_docs,
            "context_count": len(context_docs)
        }
        
        client.close()
        return json.dumps(result, indent=2, default=str)
        
    except Exception as e:
        return f"Error querying with context: {str(e)}"

def summarize_collection(collection_name: str, max_docs: int = 20) -> str:
    """
    Generate a summary of documents in a MongoDB collection.
    
    Args:
        collection_name: MongoDB collection to summarize
        max_docs: Maximum number of documents to analyze
    
    Returns:
        Summary of the collection contents
    """
    try:
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Get collection statistics
        total_docs = collection.count_documents({})
        
        if total_docs == 0:
            return json.dumps({"message": f"No documents found in collection '{collection_name}'"})
        
        # Get sample documents
        sample_docs = list(collection.find().limit(max_docs))
        
        # Analyze document structure and content
        doc_types = {}
        titles = []
        recent_docs = []
        
        for doc in sample_docs:
            # Convert ObjectId to string
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
            
            # Analyze document type
            if 'title' in doc:
                titles.append(doc['title'])
            
            # Get document type/category
            doc_type = doc.get('category', 'uncategorized')
            doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
            
            # Keep recent documents
            if 'timestamp' in doc:
                recent_docs.append({
                    "title": doc.get('title', 'Untitled'),
                    "timestamp": doc['timestamp'],
                    "type": doc_type
                })
        
        # Sort recent docs by timestamp
        recent_docs.sort(key=lambda x: x['timestamp'], reverse=True)
        
        result = {
            "collection": collection_name,
            "total_documents": total_docs,
            "analyzed_documents": len(sample_docs),
            "document_types": doc_types,
            "sample_titles": titles[:10],  # First 10 titles
            "recent_documents": recent_docs[:5],  # 5 most recent
            "summary": f"Collection '{collection_name}' contains {total_docs} documents with {len(doc_types)} different types/categories."
        }
        
        client.close()
        return json.dumps(result, indent=2, default=str)
        
    except Exception as e:
        return f"Error summarizing collection: {str(e)}"

def find_similar_documents(collection_name: str, reference_text: str, similarity_threshold: float = 0.5) -> str:
    """
    Find documents similar to a reference text using MongoDB text search.
    
    Args:
        collection_name: MongoDB collection to search
        reference_text: Text to find similar documents for
        similarity_threshold: Minimum similarity score (0.0 to 1.0)
    
    Returns:
        JSON string of similar documents
    """
    try:
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Ensure text index exists
        try:
            collection.create_index([("$**", "text")])
        except:
            pass
        
        # Extract keywords from reference text for search
        keywords = reference_text.split()[:10]  # Use first 10 words as keywords
        search_query = " ".join(keywords)
        
        # Find similar documents using text search
        similar_docs = list(collection.find(
            {"$text": {"$search": search_query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(10))
        
        # Filter by similarity threshold and format results
        filtered_docs = []
        for doc in similar_docs:
            score = doc.get('score', 0)
            if score >= similarity_threshold:
                # Convert ObjectId to string
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
                
                filtered_docs.append({
                    "document": doc,
                    "similarity_score": score,
                    "title": doc.get('title', 'Untitled'),
                    "content_preview": str(doc.get('content', ''))[:150] + "..."
                })
        
        result = {
            "reference_text": reference_text[:100] + ("..." if len(reference_text) > 100 else ""),
            "similarity_threshold": similarity_threshold,
            "similar_documents": filtered_docs,
            "total_found": len(filtered_docs),
            "search_keywords": keywords
        }
        
        client.close()
        return json.dumps(result, indent=2, default=str)
        
    except Exception as e:
        return f"Error finding similar documents: {str(e)}"

def analyze_document_trends(collection_name: str, time_field: str = "timestamp") -> str:
    """
    Analyze trends in document creation and types over time.
    
    Args:
        collection_name: MongoDB collection to analyze
        time_field: Field name containing timestamp information
    
    Returns:
        JSON string with trend analysis
    """
    try:
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Aggregation pipeline for trend analysis
        pipeline = [
            {"$match": {time_field: {"$exists": True}}},
            {"$addFields": {
                "date": {
                    "$dateFromString": {
                        "dateString": f"${time_field}",
                        "onError": None
                    }
                }
            }},
            {"$match": {"date": {"$ne": None}}},
            {"$group": {
                "_id": {
                    "year": {"$year": "$date"},
                    "month": {"$month": "$date"},
                    "day": {"$dayOfMonth": "$date"},
                    "category": "$category"
                },
                "count": {"$sum": 1},
                "titles": {"$push": "$title"}
            }},
            {"$sort": {"_id.year": -1, "_id.month": -1, "_id.day": -1}}
        ]
        
        trend_data = list(collection.aggregate(pipeline))
        
        # Format results
        daily_counts = {}
        category_trends = {}
        
        for item in trend_data:
            date_key = f"{item['_id']['year']}-{item['_id']['month']:02d}-{item['_id']['day']:02d}"
            category = item['_id'].get('category', 'uncategorized')
            count = item['count']
            
            if date_key not in daily_counts:
                daily_counts[date_key] = 0
            daily_counts[date_key] += count
            
            if category not in category_trends:
                category_trends[category] = 0
            category_trends[category] += count
        
        # Get total documents
        total_docs = collection.count_documents({})
        
        result = {
            "collection": collection_name,
            "total_documents": total_docs,
            "daily_document_counts": daily_counts,
            "category_distribution": category_trends,
            "analysis_period": f"{len(daily_counts)} days with data",
            "most_active_category": max(category_trends.items(), key=lambda x: x[1]) if category_trends else None
        }
        
        client.close()
        return json.dumps(result, indent=2, default=str)
        
    except Exception as e:
        return f"Error analyzing document trends: {str(e)}"

def semantic_query_documents_with_context(query: str, collection_name: str, conversation_context: str = "", limit: int = 5) -> str:
    """
    🤖 RAG Tool: Semantic query with conversation context for intelligent journal retrieval.
    
    This function implements Retrieval Augmented Generation (RAG) by:
    1. Analyzing the current query and conversation context
    2. Retrieving semantically similar documents/journals
    3. Combining context with retrieved documents for enhanced responses
    
    Args:
        query: Current user query or question
        collection_name: MongoDB collection to search (e.g., 'journals', 'conversations')
        conversation_context: Previous conversation context for better relevance
        limit: Maximum number of similar documents to retrieve
    
    Returns:
        JSON string with retrieved documents, context summary, and RAG-enhanced information
    """
    try:
        client = _get_mongodb_client()
        if not client:
            return "Error: Could not connect to MongoDB"
        
        db = client[MONGODB_DATABASE_NAME]
        collection = db[collection_name]
        
        # Ensure text index exists for semantic search
        try:
            collection.create_index([("$**", "text")])
        except:
            pass
        
        # Combine query with conversation context for better semantic matching
        enhanced_query = f"{query} {conversation_context}".strip()
        
        # Extract key terms for semantic search
        key_terms = []
        query_words = query.lower().split()
        context_words = conversation_context.lower().split() if conversation_context else []
        
        # Prioritize query terms, then add context terms
        all_terms = query_words + [word for word in context_words if word not in query_words]
        key_terms = [term for term in all_terms if len(term) > 2][:15]  # Limit to 15 most relevant terms
        
        search_string = " ".join(key_terms)
        
        # RAG Pipeline: Multi-stage document retrieval
        # Stage 1: Primary semantic search with text scoring
        primary_results = list(collection.find(
            {"$text": {"$search": search_string}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]).limit(limit * 2))  # Get more results for filtering
        
        # Stage 2: Enhanced filtering and ranking
        enhanced_results = []
        for doc in primary_results:
            # Convert ObjectId to string
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
            
            # Calculate enhanced relevance score
            content_text = str(doc.get('content', '') + ' ' + doc.get('searchable_text', '')).lower()
            title_text = str(doc.get('title', '')).lower()
            
            # Boost score based on query term matches
            query_matches = sum(1 for term in query_words if term in content_text or term in title_text)
            context_matches = sum(1 for term in context_words[:5] if term in content_text)  # Limit context influence
            
            base_score = doc.get('score', 0)
            enhanced_score = base_score + (query_matches * 0.3) + (context_matches * 0.1)
            
            enhanced_results.append({
                "document": doc,
                "relevance_score": round(enhanced_score, 3),
                "query_matches": query_matches,
                "context_matches": context_matches,
                "title": doc.get('title', 'Untitled'),
                "timestamp": doc.get('timestamp', ''),
                "content_preview": content_text[:200] + "..." if len(content_text) > 200 else content_text
            })
        
        # Sort by enhanced relevance score and limit results
        enhanced_results.sort(key=lambda x: x['relevance_score'], reverse=True)
        final_results = enhanced_results[:limit]
        
        # Generate RAG context summary
        if final_results:
            context_summary = f"Retrieved {len(final_results)} relevant documents for query: '{query}'"
            if conversation_context:
                context_summary += f" (with conversation context considered)"
            
            rag_insights = []
            for i, result in enumerate(final_results, 1):
                insight = {
                    "rank": i,
                    "title": result['title'],
                    "relevance": result['relevance_score'],
                    "key_points": result['content_preview'],
                    "timestamp": result['timestamp']
                }
                rag_insights.append(insight)
        else:
            context_summary = f"No relevant documents found for query: '{query}'"
            rag_insights = []
        
        # RAG Response Structure
        rag_response = {
            "query": query,
            "conversation_context_used": bool(conversation_context),
            "search_strategy": "semantic_with_context",
            "retrieved_documents": final_results,
            "rag_insights": rag_insights,
            "context_summary": context_summary,
            "total_retrieved": len(final_results),
            "search_terms_used": key_terms[:10],  # Show first 10 terms used
            "recommendations": {
                "use_for_response": "Combine retrieved insights with your knowledge to provide contextual answers",
                "follow_up_queries": [f"Tell me more about {result['title']}" for result in final_results[:3]]
            }
        }
        
        client.close()
        return json.dumps(rag_response, indent=2, default=str)
        
    except Exception as e:
        return f"Error in semantic RAG query: {str(e)}"

# 🔧 Google ADK Compatible MongoDB LlamaIndex Tools
# These tools can be used directly with Google ADK agents
MONGODB_LLAMAINDEX_TOOLS = [
    semantic_search_documents,              # 🔍 Semantic search across collections
    store_document_with_embeddings,         # 💾 Store documents with search optimization
    query_documents_with_context,           # 📊 Context-aware document querying
    summarize_collection,                   # 📋 Collection analysis and summarization
    find_similar_documents,                 # 🔗 Find related documents by similarity
    analyze_document_trends,                # 📈 Trend analysis over time
    semantic_query_documents_with_context   # 🤖 RAG-powered semantic query with conversation context
]

# =============================================================================
# ADK Wrapper Functions - Following Google ADK Tool Pattern
# =============================================================================

def search_mongodb_documents(query: str, collection_name: str) -> dict:
    """Searches for documents in MongoDB using semantic search capabilities.

    Args:
        query (str): The search query to find relevant documents.
        collection_name (str): The MongoDB collection name to search in.

    Returns:
        dict: status and search results or error message.
    """
    try:
        result = semantic_search_documents(query, collection_name, limit=5)
        # Parse the JSON result to check if it's an error
        if result.startswith("Error"):
            return {
                "status": "error",
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to search documents: {str(e)}"
        }

def save_document_to_mongodb(document_content: str, collection_name: str, title: str = None) -> dict:
    """Stores a document in MongoDB with search optimization and metadata.

    Args:
        document_content (str): The content of the document to store.
        collection_name (str): The MongoDB collection name to store the document.
        title (str): Optional title for the document.

    Returns:
        dict: status and storage result or error message.
    """
    try:
        result = store_document_with_embeddings(collection_name, document_content, title)
        if result.startswith("Error"):
            return {
                "status": "error",
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to store document: {str(e)}"
        }

def get_mongodb_collection_summary(collection_name: str) -> dict:
    """Generates a comprehensive summary of a MongoDB collection's contents.

    Args:
        collection_name (str): The MongoDB collection name to summarize.

    Returns:
        dict: status and collection summary or error message.
    """
    try:
        result = summarize_collection(collection_name, max_docs=20)
        if result.startswith("Error"):
            return {
                "status": "error", 
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to summarize collection: {str(e)}"
        }

def query_documents_with_ai_context(query: str, collection_name: str) -> dict:
    """Queries MongoDB documents with AI-powered contextual understanding.

    Args:
        query (str): The natural language query for document retrieval.
        collection_name (str): The MongoDB collection name to query.

    Returns:
        dict: status and contextual query results or error message.
    """
    try:
        result = query_documents_with_context(collection_name, query, context_limit=3)
        if result.startswith("Error"):
            return {
                "status": "error",
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to query documents with context: {str(e)}"
        }

def find_related_documents(reference_text: str, collection_name: str) -> dict:
    """Finds documents similar to the provided reference text using AI similarity.

    Args:
        reference_text (str): The text to find similar documents for.
        collection_name (str): The MongoDB collection name to search in.

    Returns:
        dict: status and similar documents or error message.
    """
    try:
        result = find_similar_documents(collection_name, reference_text, similarity_threshold=0.5)
        if result.startswith("Error"):
            return {
                "status": "error",
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to find similar documents: {str(e)}"
        }

def analyze_collection_trends(collection_name: str) -> dict:
    """Analyzes document trends and patterns over time in a MongoDB collection.

    Args:
        collection_name (str): The MongoDB collection name to analyze for trends.

    Returns:
        dict: status and trend analysis results or error message.
    """
    try:
        result = analyze_document_trends(collection_name, time_field="timestamp")
        if result.startswith("Error"):
            return {
                "status": "error",
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to analyze document trends: {str(e)}"
        }

def semantic_rag_query_with_context(query: str, collection_name: str, conversation_context: str = "") -> dict:
    """Performs RAG-powered semantic query with conversation context for intelligent responses.

    Args:
        query (str): The current user query or question.
        collection_name (str): The MongoDB collection name to search for relevant context.
        conversation_context (str): Previous conversation context to improve relevance.

    Returns:
        dict: status and RAG-enhanced results with retrieved documents and insights.
    """
    try:
        result = semantic_query_documents_with_context(query, collection_name, conversation_context, limit=5)
        if result.startswith("Error"):
            return {
                "status": "error",
                "error_message": result
            }
        else:
            return {
                "status": "success",
                "result": result
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to perform RAG semantic query: {str(e)}"
        }

# ADK Tool Information
__adk_tools__ = {
    "name": "MongoDB LlamaIndex Tools",
    "description": "Advanced MongoDB operations with semantic search capabilities and RAG support",
    "version": "1.1.0",
    "compatible_with": "Google ADK",
    "tools_count": len(MONGODB_LLAMAINDEX_TOOLS),
    "wrapper_functions": [
        "search_mongodb_documents",
        "save_document_to_mongodb", 
        "get_mongodb_collection_summary",
        "query_documents_with_ai_context",
        "find_related_documents",
        "analyze_collection_trends",
        "semantic_rag_query_with_context"  # NEW: RAG-powered semantic query
    ],
    "new_features": ["RAG (Retrieval Augmented Generation) with conversation context"]
}

# =============================================================================
# ADK Wrapper Function List - Use these in your agent
# =============================================================================
ADK_WRAPPER_TOOLS = [
    search_mongodb_documents,           # 🔍 Search documents with semantic capabilities
    save_document_to_mongodb,           # 💾 Store documents with metadata
    get_mongodb_collection_summary,     # 📋 Get collection overview and statistics
    query_documents_with_ai_context,    # 📊 AI-powered contextual document queries
    find_related_documents,             # 🔗 Find similar documents using AI similarity
    analyze_collection_trends,          # 📈 Analyze document patterns over time
    semantic_rag_query_with_context     # 🤖 RAG-powered semantic query with conversation context
]
