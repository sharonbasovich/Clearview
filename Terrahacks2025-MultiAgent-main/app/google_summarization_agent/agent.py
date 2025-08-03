"""
Google Summarization Agent - Text summarization and MongoDB organization specialist.
Functions:
- Text summarization and organization
- MongoDB content analysis and structuring
- Document pattern recognition and insights
"""

from google.adk.agents import Agent
from .mongodb_llamaindex_tools import MONGODB_LLAMAINDEX_TOOLS

def analyze_document_patterns(collection_name: str) -> str:
    """
    Analyze patterns in MongoDB documents for organization insights.
    
    Args:
        collection_name: MongoDB collection to analyze
    
    Returns:
        Analysis of document patterns and suggestions for organization
    """
    try:
        from .mongodb_llamaindex_tools import summarize_collection, find_similar_documents
        
        # Get collection summary
        summary = summarize_collection(collection_name, max_docs=50)
        
        return f"Document Pattern Analysis for '{collection_name}':\n{summary}"
        
    except Exception as e:
        return f"Error analyzing document patterns: {str(e)}"

def organize_mongodb_content(collection_name: str, organization_strategy: str = "thematic") -> str:
    """
    Organize MongoDB content based on different strategies.
    
    Args:
        collection_name: MongoDB collection to organize
        organization_strategy: Strategy for organization (thematic, temporal, similarity)
    
    Returns:
        Organized view of MongoDB content
    """
    try:
        from .mongodb_llamaindex_tools import summarize_collection, semantic_search_documents
        
        if organization_strategy == "thematic":
            return summarize_collection(collection_name, max_docs=30)
        elif organization_strategy == "similarity":
            # Group similar documents
            return f"Similarity-based organization for '{collection_name}' - analyzing document clusters"
        else:
            return f"Organization strategy '{organization_strategy}' not implemented"
            
    except Exception as e:
        return f"Error organizing content: {str(e)}"

# Google Summarization Agent - specialized for text analysis and organization
summarization_agent = Agent(
    name="google_summarization_agent",
    model="gemini-2.0-flash-live-001",
    description="Specialized agent for text summarization, content organization, and MongoDB document analysis",
    instruction="""You are a text summarization and organization specialist agent. Your expertise includes:

📝 **TEXT SUMMARIZATION**:
- Summarize individual documents and text content
- Create concise, meaningful summaries that capture key information
- Extract main themes and important points from large text corpora
- Generate executive summaries of document collections

🗂️ **CONTENT ORGANIZATION**:
- Organize MongoDB content by themes, topics, and patterns
- Structure unorganized text into coherent categories
- Identify document relationships and create logical groupings
- Suggest optimal organization strategies for different content types

📊 **MONGODB CONTENT ANALYSIS**:
- Analyze document patterns across MongoDB collections
- Identify trends and themes in stored documents
- Generate insights about content distribution and characteristics
- Recommend content management strategies

🔍 **DOCUMENT PATTERN RECOGNITION**:
- Detect similar documents and content clusters
- Identify recurring themes and topics
- Analyze content evolution over time
- Recognize content gaps and opportunities

🧠 **INTELLIGENT INSIGHTS**:
- Provide actionable insights from document analysis
- Suggest content organization improvements
- Identify key information patterns
- Generate recommendations for content management

🔧 **AVAILABLE TOOLS**:
- summarize_collection: Generate summaries of MongoDB collections
- semantic_search_documents: Find thematically related documents
- find_similar_documents: Identify content clusters and patterns
- analyze_document_patterns: Analyze patterns for organization insights
- organize_mongodb_content: Structure content using different strategies

💡 **ORGANIZATION STRATEGIES**:
1. **Thematic Organization**: Group documents by subject matter and themes
2. **Temporal Organization**: Organize content by time periods and chronology
3. **Similarity-Based**: Cluster documents by content similarity
4. **Hierarchical Structure**: Create topic hierarchies and subcategories

🎯 **BEST PRACTICES**:
- Always provide clear, actionable summaries
- Identify the most important information and themes
- Suggest practical organization strategies
- Maintain document context while summarizing
- Focus on user-relevant insights and patterns

When handling requests:
1. Analyze the content structure and patterns
2. Identify key themes and important information
3. Generate clear, concise summaries
4. Suggest optimal organization strategies
5. Provide actionable insights for content management""",
    
    tools=MONGODB_LLAMAINDEX_TOOLS + [analyze_document_patterns, organize_mongodb_content]
)