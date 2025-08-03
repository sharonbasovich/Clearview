# A2A Architecture Configuration Guide

## Overview
Your A2A (Agent-to-Agent) architecture with MongoDB specialist agent is now fully set up! This guide will help you configure the remaining components for optimal performance.

## Architecture Summary

### Main Research Agent (`research_coordinator_agent`)
- **Purpose**: Coordinates research operations and delegates to specialist agents
- **Capabilities**: Google Search, task delegation, research coordination
- **Tools**: 6 coordination tools including delegation and multi-agent workflow management

### MongoDB Specialist Agent (`mongodb_specialist_agent`)
- **Purpose**: Handles all MongoDB operations with advanced LlamaIndex integration
- **Capabilities**: Semantic search, document storage with embeddings, trend analysis
- **Tools**: 6 specialized MongoDB tools with vector search capabilities

## Configuration Steps

### 1. OpenAI API Key (Optional but Recommended)
For enhanced semantic search with embeddings:

```bash
export OPENAI_API_KEY="your-openai-api-key-here"
```

Or add to your `.env` file:
```
OPENAI_API_KEY=your-openai-api-key-here
```

**Without OpenAI**: The system will still work with basic MongoDB operations and text-based search.

### 2. MongoDB Atlas Vector Index (Optional)
For optimal semantic search performance, create a vector search index in MongoDB Atlas:

1. Go to MongoDB Atlas Dashboard
2. Navigate to your cluster → Search → Create Index
3. Use configuration:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

## Starting the System

### Option 1: A2A Architecture (Recommended)
```bash
adk web
```
Then select: **`main_research_agent`**

This gives you:
- Coordinated research with intelligent storage
- Agent-to-agent task delegation
- Semantic search and document analysis
- Advanced MongoDB operations via specialist agent

### Option 2: Direct MongoDB Agent
```bash
adk web
```
Then select: **`mongodb_specialist_agent`**

This gives you direct access to:
- Semantic search capabilities
- Document storage with embeddings
- Collection analysis and trends
- Advanced MongoDB operations

### Option 3: Basic Research Agent
```bash
adk web
```
Then select: **`root_agent`**

This gives you:
- Basic Google Search
- Simple MongoDB CRUD operations
- No agent coordination

## Usage Examples

### Research and Store
Ask the main agent:
```
"Research the latest trends in artificial intelligence and store the findings for future reference"
```

### Query Stored Research
```
"Find all my stored research about machine learning algorithms"
```

### Analyze Collection
```
"Analyze my research collection and show me the main themes and trends"
```

### Semantic Search
```
"Find documents similar to neural networks in my research collection"
```

## Testing
Run the comprehensive test suite:
```bash
python3 test_a2a_architecture.py
```

All tests should pass (4/4) for full functionality.

## Architecture Benefits

1. **Separation of Concerns**: Research logic separate from database operations
2. **Specialized Expertise**: Each agent optimized for specific tasks
3. **Scalability**: Easy to add more specialist agents
4. **Advanced Capabilities**: LlamaIndex integration for semantic operations
5. **Flexibility**: Use individual agents or coordinated A2A workflows

## Troubleshooting

### Import Errors
- Ensure all dependencies are installed: `pip3 install google-adk pymongo llama-index`

### MongoDB Connection Issues
- Verify MongoDB URI in `mongo_tools.py`
- Check network connectivity to MongoDB Atlas

### OpenAI Embedding Errors
- Set `OPENAI_API_KEY` environment variable
- Or system will fall back to basic text search

### LlamaIndex Issues
- Ensure all LlamaIndex packages are installed
- Check MongoDB Atlas supports vector operations

## Next Steps

1. **Set OpenAI API Key** for enhanced semantic search
2. **Create Vector Index** in MongoDB Atlas for optimal performance
3. **Start using A2A architecture** with `adk web` → `main_research_agent`
4. **Test with real research queries** to see the coordination in action

Your A2A architecture is ready for advanced research and knowledge management workflows!
