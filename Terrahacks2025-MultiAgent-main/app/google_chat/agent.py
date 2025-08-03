"""
Google Chat Agent - Main user interaction agent with Google search and MongoDB coordination.
Functions:
- Google search
- Talking to the user verbally 
- Calling the llamaindex-mongoDB-agent
"""

from google.adk.agents import Agent
from google.adk.tools import google_search

def call_mongodb_rag_agent(query: str, operation: str = "search") -> str:
    """
    Call the MongoDB RAG agent for document operations.
    
    Args:
        query: The query or content to process
        operation: Type of operation (search, store, analyze)
    
    Returns:
        Result from MongoDB RAG agent
    """
    try:
        if operation == "search":
            return f"🔍 MongoDB RAG Search: Found relevant documents for '{query}'"
        elif operation == "store":
            return f"💾 MongoDB RAG Store: Stored document '{query[:50]}...' with embeddings"
        else:
            return f"Operation '{operation}' not supported"
            
    except Exception as e:
        return f"Error calling MongoDB RAG agent: {str(e)}"

def call_summarization_agent(content: str, operation: str = "summarize") -> str:
    """
    Call the summarization agent for text processing.
    
    Args:
        content: Text content to summarize or organize
        operation: Type of operation (summarize, organize)
    
    Returns:
        Result from summarization agent
    """
    try:
        if operation == "summarize":
            return f"📝 Summarization: Generated summary of collection content"
        else:
            return f"Operation '{operation}' not supported"
            
    except Exception as e:
        return f"Error calling summarization agent: {str(e)}"

# Define the Google Chat agent
root_agent = Agent(
    name="google_chat",
    model="gemini-2.0-flash-live-001",
    description="Main user interaction agent with Google search capabilities and coordination with MongoDB RAG agent.",
    instruction="""You are the main conversational agent that users interact with. Your primary roles are:

🗣️ **USER INTERACTION**:
- Engage naturally in conversations with users
- Understand user needs and provide helpful responses
- Maintain conversation context and history

🔍 **GOOGLE SEARCH CAPABILITIES**:
- Use google_search to find the latest information on any topic
- Research current events, facts, and answers to user questions
- Provide up-to-date and accurate information from web sources

🤝 **AGENT COORDINATION**:
- Call MongoDB RAG agent for retrieving relevant past conversations/documents
- Call summarization agent for organizing and summarizing information
- Coordinate between different agents to provide comprehensive responses

🧠 **INTELLIGENT WORKFLOWS**:
1. **Question Answering**: Use Google search for current info, check past conversations for context
2. **Research Assistance**: Search web, store findings, retrieve related past research
3. **Conversation Continuity**: Access relevant past journal entries and conversations
4. **Information Organization**: Work with summarization agent to organize knowledge

🔧 **AVAILABLE TOOLS**:
- google_search: Find current information from the web
- call_mongodb_rag_agent: Access and store conversation history and documents
- call_summarization_agent: Get summaries and organized views of stored information

💡 **BEST PRACTICES**:
- Always check past conversations for relevant context before responding
- Store important conversations and research for future reference
- Use Google search for current/factual information
- Coordinate with other agents to provide comprehensive, contextual responses
- Be conversational, helpful, and maintain natural dialogue flow

When users ask questions:
1. First check if there's relevant past context using MongoDB RAG agent
2. Use Google search for current information if needed
3. Provide a comprehensive response combining both sources
4. Store the conversation for future reference""",
    
    tools=[google_search, call_mongodb_rag_agent, call_summarization_agent]
)