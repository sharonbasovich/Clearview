# ADK Agent with Custom MongoDB Tools

This project demonstrates how to create custom tools for Google's ADK (Agent Development Kit) that allow agents to interact with MongoDB databases.

## Features

- **Google Search Integration**: Uses the built-in Google Search tool for information retrieval
- **Custom MongoDB Tools**: Read, write, update, delete, and count documents in MongoDB
- **Natural Language Interface**: Interact with MongoDB using natural language commands through the agent

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. MongoDB Setup

Make sure you have MongoDB running. You can either:

- **Local MongoDB**: Install MongoDB locally and run it on `mongodb://localhost:27017/`
- **MongoDB Atlas**: Use MongoDB Atlas cloud service and update the connection string
- **Docker**: Run MongoDB in Docker: `docker run -d -p 27017:27017 mongo`

### 3. Environment Variables (Optional)

You can set the MongoDB connection string as an environment variable:

```bash
export MONGODB_URI="mongodb://localhost:27017/"
```

Or update the connection string directly in `agent.py`.

## MongoDB Tools Available

### 1. `write_to_mongodb`
- **Purpose**: Insert, update, or upsert documents
- **Operations**: 
  - `insert`: Add new documents
  - `update`: Modify existing documents
  - `upsert`: Insert if not exists, update if exists

### 2. `read_from_mongodb`
- **Purpose**: Query and retrieve documents
- **Features**: Supports MongoDB query syntax, pagination with limit

### 3. `delete_from_mongodb`
- **Purpose**: Remove documents matching a query
- **Safety**: Use with caution - supports bulk deletion

### 4. `count_mongodb_documents`
- **Purpose**: Count documents matching a query
- **Use case**: Get statistics about your data

## Usage Examples

### Basic Agent Commands

```python
# The agent understands natural language commands like:

# Storing data
"Store user information in the 'users' collection: {\"name\": \"Alice\", \"email\": \"alice@email.com\", \"age\": 28}"

# Reading data
"Show me all users from the database"
"Find users older than 25 in the users collection"

# Updating data
"Update Alice's age to 29 in the users collection"

# Counting
"How many users do we have in the database?"

# Combining with search
"Search for the latest Python frameworks and store the results in a 'tech_research' collection"
```

### Example Queries

#### Insert Document
```
Agent: Store this research finding: {"topic": "AI trends", "findings": ["GPT-4 improvements", "Multimodal AI"], "date": "2025-08-02"}
```

#### Query with Filter
```
Agent: Find all research documents about AI from the research collection
```

#### Update Document
```
Agent: Update the AI trends document to add "Computer Vision advances" to the findings list
```

#### Complex Research Workflow
```
Agent: Search Google for "sustainable energy technologies 2025", then store the key findings in MongoDB with proper categorization
```

## Project Structure

```
adk-streaming/
├── app/
│   └── google_search_agent/
│       ├── __init__.py
│       ├── agent.py              # Main agent configuration
│       └── mongo_tools.py        # Custom MongoDB tools
├── example_usage.py              # Usage examples
├── requirements.txt              # Python dependencies
├── main.py                       # Original ADK setup
└── README.md                     # This file
```

## MongoDB Tool Configuration

The tools are configured in `mongo_tools.py` and can be customized:

```python
# Custom configuration
mongo_tools = create_mongodb_tools(
    connection_string="your_mongodb_connection_string",
    database_name="your_database_name"
)
```

## Error Handling

The tools include comprehensive error handling for:
- Invalid JSON formats
- MongoDB connection issues
- Query syntax errors
- Network problems

## Security Considerations

- **Connection Security**: Use secure connection strings with authentication
- **Query Validation**: The tools validate JSON input but be careful with user input
- **Access Control**: Implement proper MongoDB user permissions
- **Environment Variables**: Store sensitive connection strings in environment variables

## Advanced Usage

### Custom Tool Creation

You can extend the `MongoDBTools` class to create additional tools:

```python
def create_custom_aggregation_tool(self) -> Tool:
    def aggregate_data(collection_name: str, pipeline: str) -> str:
        # Custom aggregation logic
        pass
    
    return Tool(
        name="mongodb_aggregate",
        description="Run aggregation pipelines on MongoDB",
        func=aggregate_data
    )
```

### Integration with Other Tools

The MongoDB tools work seamlessly with other ADK tools:

```python
tools = [google_search] + mongo_tools + [other_custom_tool]
```

## Troubleshooting

1. **Import Errors**: Make sure `google-adk` and `pymongo` are installed
2. **Connection Issues**: Verify MongoDB is running and connection string is correct
3. **JSON Errors**: Ensure data is properly formatted JSON when using the tools
4. **Permission Errors**: Check MongoDB user permissions for read/write operations

## Next Steps

- Add indexes to MongoDB collections for better performance
- Implement data validation schemas
- Add more sophisticated querying tools
- Integrate with other databases (PostgreSQL, Redis, etc.)
- Add backup and restore functionality
