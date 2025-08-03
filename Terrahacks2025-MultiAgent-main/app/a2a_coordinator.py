"""
A2A (Agent-to-Agent) Communication Coordinator
Enables communication between three specialized agents:
1. google-chat: User interaction + Google search + MongoDB coordination
2. llamaindex-mongoDB-agent: MongoDB RAG operations
3. google-summarization: Text summarization and organization
"""

from google.adk.agents import Agent
from google.adk.tools import google_search
from typing import Dict, Any, Optional, List
import json
import asyncio
from datetime import datetime

# Import all three agents
try:
    import sys
    import os
    sys.path.append(os.path.join(os.path.dirname(__file__), 'google-chat'))
    sys.path.append(os.path.join(os.path.dirname(__file__), 'llamaindex-mongoDB-agent'))
    sys.path.append(os.path.join(os.path.dirname(__file__), 'google-summarization'))
    
    from agent import google_chat_agent
    from agent import mongodb_rag_agent  
    from agent import summarization_agent
except ImportError as e:
    print(f"⚠️  Agent import error: {e}")
    # Create placeholder agents for development
    google_chat_agent = None
    mongodb_rag_agent = None
    summarization_agent = None

class A2ACoordinator:
    """Coordinates communication between the three specialized agents:
    1. google-chat: User interaction + Google search + MongoDB coordination
    2. llamaindex-mongoDB-agent: MongoDB RAG operations
    3. google-summarization: Text summarization and organization
    """
    
    def __init__(self):
        """Initialize the A2A coordinator with all three agents."""
        self.google_chat_agent = google_chat_agent
        self.mongodb_rag_agent = mongodb_rag_agent  
        self.summarization_agent = summarization_agent
        self.conversation_history = []
        
    async def coordinate_user_interaction(self, user_query: str, include_context: bool = True) -> Dict[str, Any]:
        """
        Coordinate user interaction with context retrieval and response generation.
        1. Google Chat agent processes user query
        2. MongoDB RAG agent retrieves relevant context
        3. Summarization agent organizes response if needed
        
        Args:
            user_query: User's question or request
            include_context: Whether to include past conversation context
            
        Returns:
            Comprehensive response with context and organization
        """
        try:
            # Step 1: Get relevant context from MongoDB RAG agent
            context_result = ""
            if include_context and self.mongodb_rag_agent:
                print(f"🧠 MongoDB RAG Agent: Retrieving context for '{user_query[:50]}...'")
                # Use semantic search to find relevant past conversations
                from app.llamaindex_mongoDB_agent.mongodb_llamaindex_tools import semantic_search_documents
                context_result = semantic_search_documents(user_query, "user_conversations", limit=3)
            
            # Step 2: Google Chat agent processes query with context
            print(f"💬 Google Chat Agent: Processing user query")
            # For now, simulate agent processing - in real implementation, would call agent
            chat_response = f"Processing query: {user_query}"
            if context_result:
                chat_response += f"\n\nRelevant context found: {context_result[:200]}..."
            
            # Step 3: Store current conversation for future context
            if self.mongodb_rag_agent:
                print(f"💾 MongoDB RAG Agent: Storing conversation")
                from app.llamaindex_mongoDB_agent.mongodb_llamaindex_tools import store_document_with_embeddings
                store_result = store_document_with_embeddings(
                    "user_conversations", 
                    f"User Query: {user_query}\nResponse: {chat_response}",
                    title=f"Conversation: {user_query[:30]}..."
                )
            
            # Step 4: Optional summarization if response is long
            summary_result = ""
            if len(chat_response) > 500 and self.summarization_agent:
                print(f"📝 Summarization Agent: Organizing response")
                from app.google_summarization.mongodb_llamaindex_tools import summarize_collection
                summary_result = summarize_collection("user_conversations", max_docs=5)
            
            coordinated_response = {
                "user_query": user_query,
                "context_retrieved": bool(context_result),
                "chat_response": chat_response,
                "summary_provided": bool(summary_result),
                "workflow": "context_retrieval -> chat_processing -> conversation_storage",
                "status": "success"
            }
            
            return coordinated_response
            
        except Exception as e:
            return {
                "user_query": user_query,
                "error": str(e),
                "status": "error",
                "workflow": "user_interaction_failed"
            }
    
    async def coordinate_research_and_organize(self, research_topic: str, collection_name: str = "research_data") -> Dict[str, Any]:
        """
        Coordinate research workflow with organization.
        1. Google Chat agent searches for information
        2. MongoDB RAG agent stores research data
        3. Summarization agent organizes and summarizes findings
        
        Args:
            research_topic: Topic to research
            collection_name: MongoDB collection for research storage
            
        Returns:
            Organized research results with summaries
        """
        try:
            # Step 1: Google search for research information
            print(f"🔍 Google Chat Agent: Searching for '{research_topic}'")
            from google.adk.tools import google_search
            search_results = google_search(f"{research_topic} latest information research")
            
            # Step 2: Store research in MongoDB with embeddings
            print(f"💾 MongoDB RAG Agent: Storing research data")
            from app.llamaindex_mongoDB_agent.mongodb_llamaindex_tools import store_document_with_embeddings
            storage_result = store_document_with_embeddings(
                collection_name,
                f"Research Topic: {research_topic}\n\nFindings:\n{search_results}",
                title=f"Research: {research_topic}"
            )
            
            # Step 3: Organize and summarize research
            print(f"📝 Summarization Agent: Organizing research findings")
            from app.google_summarization.mongodb_llamaindex_tools import summarize_collection
            organization_result = summarize_collection(collection_name, max_docs=10)
            
            # Step 4: Find related research
            print(f"🔗 MongoDB RAG Agent: Finding related research")
            from app.llamaindex_mongoDB_agent.mongodb_llamaindex_tools import find_similar_documents
            related_research = find_similar_documents(collection_name, research_topic, similarity_threshold=0.6)
            
            coordinated_response = {
                "research_topic": research_topic,
                "search_completed": True,
                "data_stored": True,
                "organization_summary": organization_result,
                "related_research": related_research,
                "workflow": "google_search -> mongodb_storage -> summarization -> related_discovery",
                "status": "success"
            }
            
            return coordinated_response
            
        except Exception as e:
            return {
                "research_topic": research_topic,
                "error": str(e),
                "status": "error",
                "workflow": "research_workflow_failed"
            }
        
    async def coordinate_search_and_store(self, query: str, collection_name: str = "research_data") -> Dict[str, Any]:
        """
        Coordinate between Google Search and MongoDB agents.
        1. Google agent searches for information
        2. MongoDB agent stores the results with embeddings
        3. Returns comprehensive response
        
        Args:
            query: Search query for Google agent
            collection_name: MongoDB collection to store results
            
        Returns:
            Combined results from both agents
        """
        try:
            # Step 1: Google Agent searches for information
            print(f"🔍 Google Agent: Searching for '{query}'")
            search_results = await self._invoke_google_search(query)
            
            # Step 2: Process and format search results
            formatted_results = self._format_search_results(search_results, query)
            
            # Step 3: MongoDB Agent stores results with embeddings
            print(f"💾 MongoDB Agent: Storing results in '{collection_name}'")
            storage_result = await self._store_with_mongodb_agent(
                formatted_results, 
                collection_name, 
                f"Search Results: {query}"
            )
            
            # Step 4: MongoDB Agent performs semantic analysis
            print(f"🧠 MongoDB Agent: Analyzing stored data")
            analysis_result = await self._analyze_with_mongodb_agent(query, collection_name)
            
            # Step 5: Combine all results
            coordinated_response = {
                "query": query,
                "search_results": search_results,
                "storage_result": storage_result,
                "semantic_analysis": analysis_result,
                "workflow": "google_search -> mongodb_storage -> semantic_analysis",
                "status": "success"
            }
            
            # Add to conversation history
            self.conversation_history.append({
                "type": "a2a_coordination",
                "query": query,
                "timestamp": self._get_timestamp(),
                "result": coordinated_response
            })
            
            return coordinated_response
            
        except Exception as e:
            error_response = {
                "query": query,
                "error": str(e),
                "status": "error",
                "workflow": "a2a_coordination_failed"
            }
            return error_response
    
    async def intelligent_research_pipeline(self, research_topic: str, collection_name: str = "research_pipeline") -> Dict[str, Any]:
        """
        Advanced research pipeline using both agents.
        1. Google agent searches for multiple aspects of the topic
        2. MongoDB agent stores and creates knowledge base
        3. MongoDB agent provides insights and connections
        
        Args:
            research_topic: Main research topic
            collection_name: MongoDB collection for research data
            
        Returns:
            Comprehensive research analysis
        """
        try:
            # Generate multiple search queries for comprehensive research
            search_queries = self._generate_research_queries(research_topic)
            
            all_search_results = []
            storage_results = []
            
            # Step 1: Conduct multiple searches
            for i, query in enumerate(search_queries):
                print(f"🔍 Research Phase {i+1}/{len(search_queries)}: {query}")
                search_result = await self._invoke_google_search(query)
                formatted_result = self._format_search_results(search_result, query)
                
                # Store each research phase
                storage_result = await self._store_with_mongodb_agent(
                    formatted_result,
                    collection_name,
                    f"Research Phase {i+1}: {query}"
                )
                
                all_search_results.append({
                    "phase": i+1,
                    "query": query,
                    "results": search_result,
                    "storage": storage_result
                })
                storage_results.append(storage_result)
            
            # Step 2: Generate comprehensive analysis
            print(f"🧠 MongoDB Agent: Generating research synthesis")
            synthesis_result = await self._synthesize_research(research_topic, collection_name)
            
            # Step 3: Find connections and patterns
            patterns_result = await self._find_research_patterns(research_topic, collection_name)
            
            research_pipeline_response = {
                "research_topic": research_topic,
                "search_phases": all_search_results,
                "synthesis": synthesis_result,
                "patterns_and_insights": patterns_result,
                "collection_name": collection_name,
                "workflow": "multi_phase_search -> knowledge_storage -> synthesis -> pattern_analysis",
                "status": "success",
                "research_depth": len(search_queries)
            }
            
            # Add to conversation history
            self.conversation_history.append({
                "type": "research_pipeline",
                "topic": research_topic,
                "timestamp": self._get_timestamp(),
                "result": research_pipeline_response
            })
            
            return research_pipeline_response
            
        except Exception as e:
            error_response = {
                "research_topic": research_topic,
                "error": str(e),
                "status": "error",
                "workflow": "research_pipeline_failed"
            }
            return error_response
    
    async def query_knowledge_base(self, question: str, collection_name: str = "research_data") -> Dict[str, Any]:
        """
        Query the knowledge base created by previous research.
        Uses MongoDB agent's RAG capabilities with conversation context.
        
        Args:
            question: Question to ask the knowledge base
            collection_name: MongoDB collection to query
            
        Returns:
            Knowledge base response with context
        """
        try:
            # Get conversation context from history
            context = self._build_conversation_context()
            
            # Use MongoDB agent's RAG capabilities
            print(f"🤖 MongoDB Agent: Querying knowledge base for '{question}'")
            rag_result = await self._rag_query_with_mongodb_agent(question, collection_name, context)
            
            # Add additional insights if available
            related_docs = await self._find_related_with_mongodb_agent(question, collection_name)
            
            knowledge_response = {
                "question": question,
                "rag_response": rag_result,
                "related_documents": related_docs,
                "collection_queried": collection_name,
                "conversation_context_used": bool(context),
                "workflow": "rag_query -> related_search -> contextual_response",
                "status": "success"
            }
            
            # Add to conversation history
            self.conversation_history.append({
                "type": "knowledge_query",
                "question": question,
                "timestamp": self._get_timestamp(),
                "result": knowledge_response
            })
            
            return knowledge_response
            
        except Exception as e:
            error_response = {
                "question": question,
                "error": str(e),
                "status": "error",
                "workflow": "knowledge_query_failed"
            }
            return error_response
    
    # Helper methods for agent communication
    
    async def _invoke_google_search(self, query: str) -> Dict[str, Any]:
        """Invoke Google search through the Google agent."""
        # Simulate agent invocation - in real implementation, use ADK's agent communication
        search_tool = google_search
        result = search_tool(query)
        return {"query": query, "results": result, "agent": "google_search_agent"}
    
    async def _store_with_mongodb_agent(self, data: str, collection: str, title: str) -> Dict[str, Any]:
        """Store data using MongoDB agent."""
        from app.mongodb_agent.mongodb_llamaindex_tools import save_document_to_mongodb
        result = save_document_to_mongodb(data, collection, title)
        return {"data_stored": True, "result": result, "agent": "mongodb_agent"}
    
    async def _analyze_with_mongodb_agent(self, query: str, collection: str) -> Dict[str, Any]:
        """Analyze data using MongoDB agent."""
        from app.mongodb_agent.mongodb_llamaindex_tools import search_mongodb_documents
        result = search_mongodb_documents(query, collection)
        return {"analysis_completed": True, "result": result, "agent": "mongodb_agent"}
    
    async def _synthesize_research(self, topic: str, collection: str) -> Dict[str, Any]:
        """Synthesize research using MongoDB agent's capabilities."""
        from app.mongodb_agent.mongodb_llamaindex_tools import get_mongodb_collection_summary
        result = get_mongodb_collection_summary(collection)
        return {"synthesis_completed": True, "result": result, "agent": "mongodb_agent"}
    
    async def _find_research_patterns(self, topic: str, collection: str) -> Dict[str, Any]:
        """Find patterns in research using MongoDB agent."""
        from app.mongodb_agent.mongodb_llamaindex_tools import analyze_collection_trends
        result = analyze_collection_trends(collection)
        return {"pattern_analysis_completed": True, "result": result, "agent": "mongodb_agent"}
    
    async def _rag_query_with_mongodb_agent(self, question: str, collection: str, context: str) -> Dict[str, Any]:
        """Perform RAG query using MongoDB agent."""
        from app.mongodb_agent.mongodb_llamaindex_tools import semantic_rag_query_with_context
        result = semantic_rag_query_with_context(question, collection, context)
        return {"rag_query_completed": True, "result": result, "agent": "mongodb_agent"}
    
    async def _find_related_with_mongodb_agent(self, text: str, collection: str) -> Dict[str, Any]:
        """Find related documents using MongoDB agent."""
        from app.mongodb_agent.mongodb_llamaindex_tools import find_related_documents
        result = find_related_documents(text, collection)
        return {"related_search_completed": True, "result": result, "agent": "mongodb_agent"}
    
    # Utility methods
    
    def _format_search_results(self, search_results: Dict[str, Any], query: str) -> str:
        """Format search results for storage."""
        formatted = {
            "search_query": query,
            "results": search_results,
            "timestamp": self._get_timestamp(),
            "source": "google_search_agent",
            "category": "web_search"
        }
        return json.dumps(formatted, indent=2)
    
    def _generate_research_queries(self, topic: str) -> list:
        """Generate multiple search queries for comprehensive research."""
        return [
            f"{topic} overview definition",
            f"{topic} current trends 2025",
            f"{topic} best practices methods",
            f"{topic} challenges problems solutions",
            f"{topic} future predictions outlook"
        ]
    
    def _build_conversation_context(self) -> str:
        """Build conversation context from history."""
        context_items = []
        for item in self.conversation_history[-5:]:  # Last 5 items
            if item["type"] == "knowledge_query":
                context_items.append(f"Previous question: {item['question']}")
            elif item["type"] == "research_pipeline":
                context_items.append(f"Research topic: {item['topic']}")
        return " ".join(context_items)
    
    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def get_conversation_history(self) -> list:
        """Get the conversation history."""
        return self.conversation_history
    
    def clear_conversation_history(self):
        """Clear the conversation history."""
        self.conversation_history = []

# Global A2A coordinator instance
a2a_coordinator = A2ACoordinator()

# ADK Tool Functions for A2A Communication

def coordinate_search_and_store(query: str, collection_name: str = "research_data") -> dict:
    """
    ADK Tool: Coordinate Google search and MongoDB storage.
    
    Args:
        query: Search query
        collection_name: MongoDB collection name
        
    Returns:
        Coordinated response from both agents
    """
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            a2a_coordinator.coordinate_search_and_store(query, collection_name)
        )
        loop.close()
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "error_message": str(e)}

def intelligent_research_pipeline(research_topic: str, collection_name: str = "research_pipeline") -> dict:
    """
    ADK Tool: Run comprehensive research pipeline using both agents.
    
    Args:
        research_topic: Main research topic
        collection_name: MongoDB collection for research data
        
    Returns:
        Comprehensive research analysis
    """
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            a2a_coordinator.intelligent_research_pipeline(research_topic, collection_name)
        )
        loop.close()
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "error_message": str(e)}

def query_knowledge_base(question: str, collection_name: str = "research_data") -> dict:
    """
    ADK Tool: Query the research knowledge base.
    
    Args:
        question: Question to ask
        collection_name: MongoDB collection to query
        
    Returns:
        Knowledge base response
    """
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            a2a_coordinator.query_knowledge_base(question, collection_name)
        )
        loop.close()
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "error_message": str(e)}

# A2A Tools List
A2A_TOOLS = [
    coordinate_search_and_store,    # 🔄 Basic search-and-store coordination
    intelligent_research_pipeline,  # 🧠 Advanced multi-phase research
    query_knowledge_base           # 💭 Query stored knowledge with RAG
]
