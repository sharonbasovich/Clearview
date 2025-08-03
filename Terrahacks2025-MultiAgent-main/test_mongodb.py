#!/usr/bin/env python3
"""
Test MongoDB connection with proper SSL configuration.
"""

from pymongo import MongoClient
import json
from datetime import datetime

def test_mongodb_connection():
    """Test MongoDB Atlas connection with SSL configuration."""
    print("🔗 Testing MongoDB Atlas connection...")
    
    connection_string = "mongodb+srv://yichenxiao08:%24%25ghedgr8@cluster0.bwg31an.mongodb.net"
    
    try:
        # Connect with proper SSL settings
        client = MongoClient(
            connection_string,
            tls=True,
            tlsAllowInvalidCertificates=True,  # For development
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000
        )
        
        # Test the connection
        client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Test database operations
        db = client.agent_conversations
        collection = db.test_messages
        
        # Insert a test document
        test_doc = {
            "test_message": "Hello from ADK Agent!",
            "timestamp": datetime.now().isoformat(),
            "user": "test_user",
            "status": "connection_test"
        }
        
        result = collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Read it back
        found_doc = collection.find_one({"_id": result.inserted_id})
        print(f"✅ Test document retrieved: {found_doc['test_message']}")
        
        # Count documents
        count = collection.count_documents({})
        print(f"📊 Total documents in test_messages collection: {count}")
        
        # List some recent documents
        recent_docs = list(collection.find().sort("_id", -1).limit(3))
        print(f"📄 Recent documents: {len(recent_docs)} found")
        
        # Clean up the test document
        collection.delete_one({"_id": result.inserted_id})
        print("🧹 Test document cleaned up")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

def test_tools_directly():
    """Test the MongoDB tools directly."""
    print("\n🔧 Testing MongoDB tools directly...")
    
    try:
        from app.chat_agent_google_agent.mongo_tools import write_to_mongodb, read_from_mongodb, count_mongodb_documents
        
        # Test write
        test_data = json.dumps({
            "user": "direct_test",
            "message": "Testing MongoDB tools directly",
            "timestamp": datetime.now().isoformat(),
            "source": "direct_tool_test"
        })
        
        write_result = write_to_mongodb("test_messages", test_data)
        print(f"✅ Write tool result: {write_result}")
        
        # Test read
        read_result = read_from_mongodb("test_messages", '{"source": "direct_tool_test"}', 5)
        print(f"✅ Read tool found documents: {len(json.loads(read_result))} documents")
        
        # Test count
        count_result = count_mongodb_documents("test_messages", "{}")
        print(f"✅ Count tool result: {count_result}")
        
        return True
        
    except Exception as e:
        print(f"❌ Tool test failed: {e}")
        return False

def main():
    print("🧪 MongoDB Connection & Tools Test")
    print("=" * 40)
    
    success = True
    
    # Test direct MongoDB connection
    if not test_mongodb_connection():
        success = False
    
    # Test tools
    if not test_tools_directly():
        success = False
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 All tests passed! MongoDB is ready for the agent.")
        print("\n🚀 Your agent can now:")
        print("   ✓ Connect to MongoDB Atlas")
        print("   ✓ Store conversation data")
        print("   ✓ Retrieve stored information")
        print("   ✓ Search and count documents")
        
        print("\n💡 Ready to start chatting! Run:")
        print("   adk web")
    else:
        print("❌ Some tests failed. Check the errors above.")
    
    return success

if __name__ == "__main__":
    main()
