"""
MongoDB LlamaIndex tools for advanced database operations.
"""

from llama_index.core import Document, VectorStoreIndex, Settings
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.readers.mongodb import SimpleMongoReader
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.embeddings.google import GeminiEmbedding
import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from pymongo import MongoClient

# MongoDB connection settings - using environment variables  
MONGODB_CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING", "mongodb+srv://yichenxiao08:%24%25ghedgr8@cluster0.bwg31an.mongodb.net")
MONGODB_DATABASE_NAME = os.getenv("MONGODB_DATABASE_NAME", "agent_conversations")

def _get_mongodb_client():
    """Get MongoDB client with proper configuration."""
    try:
        client = MongoClient(
            MONGODB_CONNECTION_STRING,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000
        )
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return None

def semantic_search_documents(query: str, collection_name: str, limit: int = 5) -> str:
    """
    Perform semantic search on MongoDB documents using LlamaIndex.
    
    Args:
        query: Natural language query
        collection_name: MongoDB collection to search
        limit: Maximum number of results
    
    Returns:
        JSON string of semantically relevant documents
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
    Store a document in MongoDB with metadata for future semantic search.
    
    Args:
        collection_name: MongoDB collection name
        document: Document content (JSON string or plain text)
        title: Optional title for the document
    
    Returns:
        Result of the storage operation
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

# MongoDB LlamaIndex tools for the agent
MONGODB_LLAMAINDEX_TOOLS = [
    semantic_search_documents,
    store_document_with_embeddings,
    query_documents_with_context,
    summarize_collection,
    find_similar_documents,
    analyze_document_trends
]
