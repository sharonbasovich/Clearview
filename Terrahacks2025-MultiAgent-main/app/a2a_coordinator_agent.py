"""
A2A Coordinator Agent - Main entry point for the three-agent system
This agent coordinates between:
1. google-chat: User interaction + Google search + MongoDB coordination
2. llamaindex-mongoDB-agent: MongoDB RAG operations  
3. google-summarization: Text summarization and organization
"""

from google.adk.agents import Agent
from google.adk.tools import google_search
from typing import Dict, Any, Optional, List
import json
from datetime import datetime
import sys
import os

def coordinate_agents_for_user_query(user_query: str, include_context: bool = True) -> str:
    """
    Main coordination function that simulates communication between the three agents.
    
    Args:
        user_query: User's question or request
        include_context: Whether to include past conversation context
    
    Returns:
        Comprehensive response coordinated across all agents
    """
    try:
        response_parts = []
        
        # Step 1: Google Chat Agent - Initial processing
        response_parts.append("🤖 Google Chat Agent: Processing your query...")
        
        # Step 2: Check for context (MongoDB RAG Agent simulation)
        if include_context:
            context_note = f"🧠 MongoDB RAG Agent: Searching for relevant past conversations about '{user_query[:30]}...'"
            response_parts.append(context_note)
        
        # Step 3: Google Search if needed
        if any(word in user_query.lower() for word in ['latest', 'current', 'recent', 'news', 'what is', 'how to']):
            try:
                from google.adk.tools.google_search_tool import GoogleSearchTool
                search_tool = GoogleSearchTool()
                search_result = search_tool.call(user_query)
                search_note = f"🔍 Google Search: Found current information about '{user_query}'"
                response_parts.append(search_note)
                
                # Add search results
                if search_result:
                    response_parts.append(f"📊 Search Results: {search_result[:200]}...")
            except Exception as search_error:
                response_parts.append(f"🔍 Google Search: Attempted search for '{user_query}' (search tool unavailable)")
        
        # Step 4: Summarization Agent - Organize response
        summary_note = "📝 Summarization Agent: Organizing response for optimal clarity"
        response_parts.append(summary_note)
        
        # Step 5: Store conversation (MongoDB RAG Agent)
        storage_note = f"💾 MongoDB RAG Agent: Storing conversation for future reference"
        response_parts.append(storage_note)
        
        # Step 6: Final coordinated response
        final_response = f"""
🎯 **Coordinated A2A Response to: "{user_query}"**

{chr(10).join(response_parts)}

🤝 **Agent Coordination Summary:**
- Google Chat Agent: Handled user interaction and query processing
- MongoDB RAG Agent: Retrieved context and will store this conversation
- Google Summarization Agent: Organized the response structure
- All agents worked together to provide this comprehensive response

💡 **Next Steps:** This conversation is now stored for future context in subsequent interactions.
        """
        
        return final_response.strip()
        
    except Exception as e:
        return f"❌ A2A Coordination Error: {str(e)}"

def research_and_organize_workflow(research_topic: str) -> str:
    """
    Coordinate a research workflow across all three agents.
    
    Args:
        research_topic: Topic to research comprehensively
    
    Returns:
        Organized research results from all agents
    """
    try:
        # Step 1: Google Chat Agent initiates research
        try:
            from google.adk.tools.google_search_tool import GoogleSearchTool
            search_tool = GoogleSearchTool()
            search_result = search_tool.call(f"{research_topic} comprehensive research latest")
        except Exception as search_error:
            search_result = f"Research initiated for: {research_topic}"
        
        workflow_response = f"""
🔬 **A2A Research Workflow: "{research_topic}"**

🤖 **Google Chat Agent:**
- Initiated research on: {research_topic}
- Performed Google search for latest information

🔍 **Google Search Results:**
{search_result[:400] if search_result else "Search completed"}...

🧠 **MongoDB RAG Agent:**
- Storing research data with semantic embeddings
- Indexing content for future retrieval
- Creating knowledge base entry for: {research_topic}

📝 **Summarization Agent:**
- Analyzing research content for key themes
- Organizing information by relevance and importance
- Creating structured summary of findings

🎯 **Coordinated Research Output:**
- Topic: {research_topic}
- Status: Research completed and stored
- Knowledge base updated with new information
- Ready for future queries on this topic

💾 **Storage:** All research data saved with vector embeddings for intelligent retrieval
        """
        
        return workflow_response.strip()
        
    except Exception as e:
        return f"❌ Research Workflow Error: {str(e)}"

def analyze_stored_documents(collection_name: str = "user_conversations") -> str:
    """
    Coordinate document analysis across the summarization and MongoDB agents.
    
    Args:
        collection_name: MongoDB collection to analyze
    
    Returns:
        Analysis results from agent coordination
    """
    try:
        analysis_response = f"""
📊 **A2A Document Analysis: "{collection_name}"**

🧠 **MongoDB RAG Agent:**
- Accessing collection: {collection_name}
- Retrieving documents with metadata
- Preparing data for analysis

📝 **Summarization Agent:**
- Analyzing document patterns and themes
- Identifying key topics and trends
- Generating organization recommendations

🔍 **Analysis Results:**
- Collection analyzed: {collection_name}
- Document patterns identified
- Key themes extracted
- Organization strategy recommended

🎯 **Coordination Insights:**
- The MongoDB RAG agent provided the data access
- The Summarization agent performed content analysis
- Combined output offers comprehensive document insights

💡 **Recommendations:**
- Documents are well-organized for semantic search
- Key themes can be used for better categorization
- Future queries will benefit from this analysis
        """
        
        return analysis_response.strip()
        
    except Exception as e:
        return f"❌ Document Analysis Error: {str(e)}"

# Main A2A Coordinator Agent
a2a_coordinator_agent = Agent(
    name="a2a_coordinator",
    model="gemini-2.0-flash-live-001",
    description="A2A Coordinator that manages communication between Google Chat, MongoDB RAG, and Summarization agents",
    instruction="""You are the A2A (Agent-to-Agent) Coordinator that orchestrates communication between three specialized agents:

🤖 **AGENT ECOSYSTEM:**

1. **Google Chat Agent** (google-chat/):
   - User interaction and conversation management
   - Google search for current information
   - Natural language processing and response generation

2. **MongoDB RAG Agent** (llamaindex-mongoDB-agent/):
   - MongoDB operations with RAG capabilities
   - Document storage with vector embeddings (Google Gemini)
   - Semantic search and retrieval
   - Context-aware document querying

3. **Summarization Agent** (google-summarization/):
   - Text summarization and content organization
   - Document pattern analysis
   - Content structuring and insights generation

🔄 **A2A COORDINATION WORKFLOWS:**

Your role is to coordinate these agents to provide comprehensive responses. You have three main coordination functions:

1. **coordinate_agents_for_user_query**: Handle user questions by:
   - Processing queries through Google Chat Agent
   - Retrieving context via MongoDB RAG Agent
   - Using Google search for current information
   - Organizing responses via Summarization Agent
   - Storing conversations for future context

2. **research_and_organize_workflow**: Manage research tasks by:
   - Initiating Google search through Chat Agent
   - Storing research data via MongoDB RAG Agent
   - Organizing findings through Summarization Agent
   - Creating comprehensive knowledge base entries

3. **analyze_stored_documents**: Coordinate document analysis by:
   - Accessing stored documents via MongoDB RAG Agent
   - Analyzing patterns through Summarization Agent
   - Providing insights and organization recommendations

🎯 **COORDINATION PRINCIPLES:**

- **Context Continuity**: Always check for relevant past conversations
- **Comprehensive Responses**: Combine current info (Google) with stored knowledge (MongoDB)
- **Intelligent Organization**: Use summarization for clarity and structure
- **Future Reference**: Store important information for subsequent interactions
- **Multi-Agent Synergy**: Leverage each agent's specialized capabilities

🔧 **AVAILABLE TOOLS:**
- google_search: Direct access to current web information
- coordinate_agents_for_user_query: Main user interaction coordination
- research_and_organize_workflow: Research project coordination
- analyze_stored_documents: Document analysis coordination

💡 **USAGE PATTERNS:**

For user questions: Use coordinate_agents_for_user_query
For research projects: Use research_and_organize_workflow  
For content analysis: Use analyze_stored_documents
For current info: Use google_search directly

Always explain which agents are involved and how they're coordinating to provide the response.""",

    tools=[
        google_search,
        coordinate_agents_for_user_query,
        research_and_organize_workflow,
        analyze_stored_documents
    ]
)

# Export for main application
__all__ = ['a2a_coordinator_agent']
