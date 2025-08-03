#!/usr/bin/env python3
"""
Test script to verify MongoDB connection and ADK agent functionality.
This will test the MongoDB connection and basic agent operations.
"""

import asyncio
import json
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# Test MongoDB connection first
def test_mongodb_connection():
    """Test direct MongoDB connection."""
    print("🔗 Testing MongoDB Atlas connection...")
    
    connection_string = "mongodb+srv://yichenxiao08:%24%25ghedgr8@cluster0.bwg31an.mongodb.net"
    
    try:
        # Test connection
        client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        
        # Ping the server
        client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Test database operations
        db = client.test_db
        collection = db.test_collection
        
        # Insert test document
        test_doc = {
            "test_type": "connection_test",
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        }
        
        result = collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Read back the document
        found_doc = collection.find_one({"_id": result.inserted_id})
        print(f"✅ Test document retrieved: {found_doc['test_type']}")
        
        # Clean up test document
        collection.delete_one({"_id": result.inserted_id})
        print("✅ Test document cleaned up")
        
        # List databases (to verify permissions)
        databases = client.list_database_names()
        print(f"📁 Available databases: {databases}")
        
        client.close()
        return True
        
    except PyMongoError as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def test_mongo_tools():
    """Test the custom MongoDB tools."""
    print("\n🔧 Testing MongoDB tools...")
    
    try:
        from app.chat_agent_google_agent.mongo_tools import create_mongodb_tools
        
        # Create tools
        tools = create_mongodb_tools(
            connection_string="mongodb+srv://yichenxiao08:%24%25ghedgr8@cluster0.bwg31an.mongodb.net",
            database_name="agent_test_db"
        )
        
        print(f"✅ Created {len(tools)} MongoDB tools:")
        for tool in tools:
            print(f"   - {tool.name}: {tool.description}")
        
        # Test write tool
        write_tool = tools[0]  # write_to_mongodb
        test_document = json.dumps({
            "user": "test_user",
            "message": "Hello from ADK agent!",
            "timestamp": datetime.now().isoformat()
        })
        
        result = write_tool.func("test_messages", test_document, "insert")
        print(f"✅ Write tool test: {result}")
        
        # Test read tool
        read_tool = tools[1]  # read_from_mongodb
        result = read_tool.func("test_messages", "{}", 5)
        print(f"✅ Read tool test: Found {len(json.loads(result))} documents")
        
        # Test count tool
        count_tool = tools[3]  # count_mongodb_documents
        result = count_tool.func("test_messages", "{}")
        print(f"✅ Count tool test: {result}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Tool test failed: {e}")
        return False


async def test_agent_basic():
    """Test basic agent functionality (without actual chat)."""
    print("\n🤖 Testing ADK agent setup...")
    
    try:
        from app.chat_agent_google_agent.agent import root_agent
        
        print(f"✅ Agent created successfully:")
        print(f"   - Name: {root_agent.name}")
        print(f"   - Model: {root_agent.model}")
        print(f"   - Tools: {len(root_agent.tools)} tools available")
        
        # List available tools
        tool_names = [tool.name for tool in root_agent.tools]
        print(f"   - Available tools: {', '.join(tool_names)}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Agent import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Agent setup failed: {e}")
        return False


def create_sample_conversation_test():
    """Create a sample conversation document for testing."""
    print("\n💬 Creating sample conversation for testing...")
    
    connection_string = "mongodb+srv://yichenxiao08:%24%25ghedgr8@cluster0.bwg31an.mongodb.net"
    
    try:
        client = MongoClient(connection_string)
        db = client.agent_conversations
        collection = db.chat_history
        
        sample_conversation = {
            "session_id": "test_session_001",
            "user_id": "test_user",
            "timestamp": datetime.now().isoformat(),
            "messages": [
                {
                    "role": "user",
                    "content": "Hello! Can you search for information about sustainable energy and save it to the database?",
                    "timestamp": datetime.now().isoformat()
                },
                {
                    "role": "assistant", 
                    "content": "I'll search for sustainable energy information and store the findings in MongoDB for you.",
                    "timestamp": datetime.now().isoformat(),
                    "tools_used": ["google_search", "write_to_mongodb"]
                }
            ],
            "status": "active"
        }
        
        result = collection.insert_one(sample_conversation)
        print(f"✅ Sample conversation created with ID: {result.inserted_id}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to create sample conversation: {e}")
        return False


def main():
    """Run all tests."""
    print("🧪 ADK Agent with MongoDB - System Test")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 4
    
    # Test 1: MongoDB Connection
    if test_mongodb_connection():
        tests_passed += 1
    
    # Test 2: MongoDB Tools
    if test_mongo_tools():
        tests_passed += 1
    
    # Test 3: Agent Setup
    if asyncio.run(test_agent_basic()):
        tests_passed += 1
    
    # Test 4: Sample Data
    if create_sample_conversation_test():
        tests_passed += 1
    
    # Results
    print("\n" + "=" * 50)
    print(f"🏁 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Your system is ready.")
        print("\n🚀 You can now:")
        print("   1. Chat with the AI agent")
        print("   2. The agent will use Google Search")
        print("   3. The agent will store conversations and research in MongoDB")
        print("   4. You can ask the agent to retrieve stored information")
        
        print("\n💡 Example commands to try:")
        print('   "Search for the latest AI trends and save them to the database"')
        print('   "Show me all the research we have stored"')
        print('   "Count how many conversations we have had"')
        
    else:
        print("❌ Some tests failed. Please check the errors above.")
        
    return tests_passed == total_tests


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
