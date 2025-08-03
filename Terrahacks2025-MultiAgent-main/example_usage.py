"""
Example usage of the ADK agent with custom MongoDB tools.
This demonstrates how to use the agent to search for information and store it in MongoDB.
"""

import asyncio
from app.chat_agent_google_agent.agent import unified_agent


async def example_usage():
    """Example of using the agent with MongoDB tools."""
    
    # Example 1: Search for information and store it
    print("=== Example 1: Search and Store ===")
    response = await unified_agent.send_message(
        """Search for information about the latest developments in artificial intelligence in 2025. 
        Then store the key findings in MongoDB in a collection called 'ai_research' with the following structure:
        {
            "topic": "AI developments 2025",
            "date_researched": "2025-08-02", 
            "key_findings": ["finding1", "finding2", ...],
            "sources": ["url1", "url2", ...]
        }"""
    )
    print("Agent Response:", response)
    
    # Example 2: Read stored research
    print("\n=== Example 2: Read Stored Research ===")
    response = await unified_agent.send_message(
        """Read all documents from the 'ai_research' collection in MongoDB and summarize what research we have stored."""
    )
    print("Agent Response:", response)
    
    # Example 3: Count documents
    print("\n=== Example 3: Count Research Documents ===")
    response = await unified_agent.send_message(
        """Count how many research documents we have in the 'ai_research' collection."""
    )
    print("Agent Response:", response)
    
    # Example 4: Search for specific research
    print("\n=== Example 4: Query Specific Research ===")
    response = await unified_agent.send_message(
        """Search the MongoDB 'ai_research' collection for any research related to machine learning and show me those documents."""
    )
    print("Agent Response:", response)


async def mongodb_tool_examples():
    """Direct examples of how to use MongoDB tools."""
    
    print("=== Direct MongoDB Tool Usage Examples ===")
    
    # The agent can use these tools with natural language commands like:
    
    examples = [
        "Store this data in MongoDB collection 'users': {\"name\": \"John Doe\", \"email\": \"john@example.com\", \"age\": 30}",
        
        "Read all documents from the 'users' collection",
        
        "Find users in MongoDB where age is greater than 25: {\"age\": {\"$gt\": 25}}",
        
        "Update user John Doe's age to 31: {\"filter\": {\"name\": \"John Doe\"}, \"update\": {\"$set\": {\"age\": 31}}}",
        
        "Count how many users are in the database",
        
        "Delete users older than 65: {\"age\": {\"$gt\": 65}}"
    ]
    
    for i, example in enumerate(examples, 1):
        print(f"\nExample {i}: {example}")
        # In practice, you would send these as messages to the agent:
        # response = await unified_agent.send_message(example)


if __name__ == "__main__":
    print("ADK Agent with MongoDB Tools Example")
    print("=" * 50)
    
    # Run the examples
    asyncio.run(example_usage())
    
    print("\n" + "=" * 50)
    asyncio.run(mongodb_tool_examples())
