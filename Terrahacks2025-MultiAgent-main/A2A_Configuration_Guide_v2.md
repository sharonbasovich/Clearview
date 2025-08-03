# A2A (Agent-to-Agent) Configuration Guide

## Overview
This guide explains the A2A (Agent-to-Agent) communication system that coordinates between the Google Search Agent and MongoDB LlamaIndex Agent for intelligent research workflows.

## Architecture

### 🏗️ System Components

1. **Google Search Agent** (`app/google_search_agent/`)
   - Capabilities: Web search, current information retrieval
   - Tools: `google_search`

2. **MongoDB LlamaIndex Agent** (`app/mongodb_agent/`)
   - Capabilities: Document storage, semantic search, RAG queries
   - Tools: 7 MongoDB operations with Gemini embeddings
   - Features: Vector embeddings, trend analysis, contextual queries

3. **A2A Coordinator** (`app/a2a_coordinator.py`)
   - Capabilities: Agent communication, workflow orchestration
   - Tools: 3 coordination functions
   - Features: Research pipelines, knowledge synthesis

4. **Unified A2A Agent** (`app/unified_a2a_agent.py`)
   - Combines all capabilities in one agent
   - Total Tools: 11 (1 Google + 7 MongoDB + 3 A2A)
   - Model: `gemini-2.0-flash-live-001`

## A2A Workflows

### 🔄 Basic Search-and-Store Workflow

```
User Query → Google Search → Format Results → Store in MongoDB → Return Combined Response
```

**Tool**: `coordinate_search_and_store(query, collection_name)`

**Example**:
```python
result = coordinate_search_and_store("artificial intelligence trends 2025", "ai_research")
```

### 🧠 Advanced Research Pipeline

```
Research Topic → Multiple Search Phases → Knowledge Storage → Synthesis → Pattern Analysis
```

**Tool**: `intelligent_research_pipeline(research_topic, collection_name)`

**Phases**:
1. Overview and definitions
2. Current trends
3. Best practices
4. Challenges and solutions
5. Future predictions

**Example**:
```python
result = intelligent_research_pipeline("machine learning in healthcare", "ml_healthcare_research")
```

### 🤖 RAG-Enhanced Knowledge Queries

```
Question → Conversation Context → Knowledge Retrieval → Related Documents → Enhanced Response
```

**Tool**: `query_knowledge_base(question, collection_name)`

**Features**:
- Uses conversation history for context
- Semantic similarity matching
- Multi-document synthesis

## Configuration

### 📋 Requirements.txt (Clean)

```txt
# Core ADK and Agent Dependencies
google-adk>=1.4.0
uvicorn>=0.27.0
fastapi>=0.110.0

# MongoDB Dependencies
pymongo>=4.6.0
motor>=3.3.0

# LlamaIndex Core and MongoDB Integration
llama-index-core>=0.13.0
llama-index-vector-stores-mongodb>=0.3.0
llama-index-embeddings-google>=0.4.0
llama-index-readers-mongodb>=0.2.0

# Google AI and Embeddings
google-generativeai>=0.5.2,<0.6
google-ai-generativelanguage>=0.6.4,<0.7.0
google-genai>=1.21.0

# Data Processing and Utilities
python-dotenv>=1.0.0
pydantic>=2.6.0
typing-extensions>=4.9.0
```

### 🔧 Environment Variables (.env)

```env
# MongoDB Connection
MONGODB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DATABASE_NAME=agent_conversations
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# Google AI Configuration
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_CLOUD_LOCATION=us-central1
```

### 🚀 Deployment

```bash
# 1. Activate environment
conda activate BrainRotFastAPI-Model-Inference

# 2. Install clean dependencies
pip install -r requirements.txt

# 3. Run tests
python test_a2a_system.py

# 4. Start the agent
adk web
```

## Usage Examples

### Example 1: Basic Research
```
User: "Research quantum computing applications"

A2A Workflow:
1. coordinate_search_and_store("quantum computing applications", "quantum_research")
2. Returns: Web search results + MongoDB storage confirmation
```

### Example 2: Comprehensive Research
```
User: "I need a comprehensive analysis of renewable energy trends"

A2A Workflow:
1. intelligent_research_pipeline("renewable energy trends", "energy_research")
2. Phases:
   - "renewable energy trends overview definition"
   - "renewable energy trends current trends 2025" 
   - "renewable energy trends best practices methods"
   - "renewable energy trends challenges problems solutions"
   - "renewable energy trends future predictions outlook"
3. Returns: Multi-phase analysis + synthesis + patterns
```

### Example 3: Knowledge Base Query
```
User: "What did we learn about solar panel efficiency?"

A2A Workflow:
1. query_knowledge_base("solar panel efficiency", "energy_research")
2. Uses previous research context
3. Returns: RAG-enhanced response + related documents
```

## Tool Descriptions

### 🔍 Google Search Tools
- `google_search`: Find latest web information

### 💾 MongoDB LlamaIndex Tools  
- `search_mongodb_documents`: Semantic search
- `save_document_to_mongodb`: Store with metadata
- `get_mongodb_collection_summary`: Collection analysis
- `query_documents_with_ai_context`: AI contextual queries
- `find_related_documents`: Similarity search
- `analyze_collection_trends`: Pattern analysis
- `semantic_rag_query_with_context`: RAG queries

### 🔄 A2A Coordination Tools
- `coordinate_search_and_store`: Basic search-store workflow
- `intelligent_research_pipeline`: Multi-phase research
- `query_knowledge_base`: Knowledge base queries

## Benefits

### 🎯 Intelligence Enhancement
- **Contextual Understanding**: Combines web search with stored knowledge
- **Semantic Connections**: Finds patterns across research sessions
- **Progressive Learning**: Builds knowledge base over time

### ⚡ Efficiency Gains
- **Automated Workflows**: No manual copy-paste between search and storage
- **Multi-phase Research**: Comprehensive analysis in single command
- **Context Preservation**: Conversation history enhances responses

### 📊 Knowledge Management
- **Organized Storage**: Research organized by topics and collections
- **Trend Analysis**: Understand research patterns over time
- **RAG Enhancement**: Intelligent retrieval for better responses

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Solution: Run `pip install -r requirements.txt`
   - Check: `python test_a2a_system.py`

2. **MongoDB Connection**
   - Solution: Verify MONGODB_CONNECTION_STRING in .env
   - Test: Check connection in test script

3. **Google Embeddings**
   - Solution: Ensure Google Cloud authentication
   - Check: GOOGLE_GENAI_USE_VERTEXAI=TRUE

4. **Package Conflicts**
   - Solution: Remove langchain-google-genai if installed
   - Use: Compatible versions in requirements.txt

### Performance Tips

1. **Collection Organization**
   - Use descriptive collection names
   - Group related research together
   - Regular collection summaries

2. **Query Optimization**
   - Use specific questions for better RAG results
   - Include context for follow-up queries
   - Build on previous research

3. **Resource Management**
   - Monitor MongoDB storage usage
   - Clean up test collections regularly
   - Use appropriate embedding dimensions (768 for Gemini)

## Next Steps

1. **Test the System**: Run `python test_a2a_system.py`
2. **Start Agent**: Run `adk web`
3. **Try Workflows**: Test with simple research topics
4. **Build Knowledge**: Use research pipelines for comprehensive topics
5. **Query Insights**: Use RAG queries to explore stored knowledge

The A2A system is now ready for intelligent research workflows with seamless coordination between web search and knowledge storage!
