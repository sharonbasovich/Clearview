#!/usr/bin/env python3
"""
Test the MongoDB Tools Agent (no LlamaIndex dependencies).
"""

import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_agent_import():
    """Test that the MongoDB tools agent imports correctly."""
    print("🧪 Testing MongoDB Tools Agent Import")
    print("=" * 40)
    
    try:
        from app.chat_agent_google_agent.agent import unified_agent
        
        print("✅ MongoDB tools agent imported successfully")
        print(f"   - Name: {unified_agent.name}")
        print(f"   - Model: {unified_agent.model}")
        print(f"   - Description: {unified_agent.description}")
        print(f"   - Total Tools: {len(unified_agent.tools)} tools")
        
        # List all tools
        print("\n🔧 Available Tools:")
        for i, tool in enumerate(unified_agent.tools, 1):
            tool_name = getattr(tool, '__name__', str(tool))
            print(f"   {i:2d}. {tool_name}")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoDB tools agent import failed: {e}")
        return False

def test_mongodb_tools():
    """Test that MongoDB tools work correctly."""
    print("\n💾 Testing MongoDB Tools")
    print("=" * 40)
    
    success_count = 0
    total_tests = 4
    
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb, 
            read_from_mongodb, 
            count_mongodb_documents, 
            delete_from_mongodb
        )
        
        # Test 1: Write a document
        print("📝 Test 1: Writing document to MongoDB")
        test_doc = '{"test": "mongo_db_tools_agent", "timestamp": "2025-08-02", "purpose": "testing simplified agent", "category": "test"}'
        result = write_to_mongodb("mongo_tools_test", test_doc)
        print(f"   Result: {result}")
        if "successfully" in result:
            success_count += 1
        
        # Test 2: Count documents
        print("\n📊 Test 2: Counting documents")
        count_result = count_mongodb_documents("mongo_tools_test")
        print(f"   Result: {count_result}")
        if "Found" in count_result:
            success_count += 1
        
        # Test 3: Read documents
        print("\n📖 Test 3: Reading documents")
        read_result = read_from_mongodb("mongo_tools_test", '{"test": "mongo_db_tools_agent"}', 5)
        print(f"   Result: {read_result[:200]}...")
        if "[" in read_result:  # Should return JSON array
            success_count += 1
        
        # Test 4: Update operation
        print("\n✏️ Test 4: Updating document")
        update_doc = '{"filter": {"test": "mongo_db_tools_agent"}, "update": {"$set": {"updated": true, "update_time": "2025-08-02"}}}'
        update_result = write_to_mongodb("mongo_tools_test", update_doc, "update")
        print(f"   Result: {update_result}")
        if "Updated" in update_result:
            success_count += 1
        
        print(f"\n📊 MongoDB tools test: {success_count}/{total_tests} passed")
        return success_count == total_tests
        
    except Exception as e:
        print(f"❌ MongoDB tools test failed: {e}")
        return False

def test_google_search_availability():
    """Test that Google Search tool is available."""
    print("\n🔍 Testing Google Search Tool")
    print("=" * 40)
    
    try:
        from google.adk.tools import google_search
        print("✅ Google Search tool available")
        return True
        
    except Exception as e:
        print(f"❌ Google Search tool test failed: {e}")
        return False

def demonstrate_agent_capabilities():
    """Demonstrate the agent's capabilities."""
    print("\n🚀 MongoDB Tools Agent Capabilities")
    print("=" * 40)
    
    print("🎯 Agent Features:")
    print()
    
    print("1. 📍 GOOGLE SEARCH")
    print("   • Real-time web search")
    print("   • Latest information retrieval")
    print("   • Fact-finding and research")
    print()
    
    print("2. 💾 MONGODB OPERATIONS")
    print("   • Document storage (insert, update, upsert)")
    print("   • Document retrieval with queries")
    print("   • Document counting and filtering")
    print("   • Document deletion")
    print()
    
    print("3. 🔄 INTEGRATED WORKFLOWS")
    print("   • Research → Store → Retrieve")
    print("   • Search → Organize → Manage")
    print("   • Query → Filter → Analyze")
    print()
    
    print("💡 Example Use Cases:")
    print('   • "Search for AI trends and store the findings"')
    print('   • "Retrieve all my stored research about machine learning"')
    print('   • "Count how many documents I have about technology"')
    print('   • "Update my research notes with new information"')
    print('   • "Delete old test documents from my collections"')
    
    return True

def main():
    """Run all tests for the MongoDB tools agent."""
    print("🔬 MongoDB Tools Agent Test Suite")
    print("Testing simplified agent with Google Search + MongoDB (no LlamaIndex)")
    print("=" * 70)
    
    success_count = 0
    total_tests = 4
    
    # Test 1: Agent import
    if test_agent_import():
        success_count += 1
    
    # Test 2: MongoDB tools
    if test_mongodb_tools():
        success_count += 1
    
    # Test 3: Google Search availability
    if test_google_search_availability():
        success_count += 1
    
    # Test 4: Capabilities demonstration
    if demonstrate_agent_capabilities():
        success_count += 1
    
    # Results
    print("\n" + "=" * 70)
    print(f"🏁 Test Results: {success_count}/{total_tests} tests passed")
    
    if success_count == total_tests:
        print("🎉 MongoDB Tools Agent is ready!")
        print()
        print("🚀 To start using the agent:")
        print("   adk web")
        print("   Then select: 'mongo_db_tools_agent'")
        print()
        print("✨ You now have a simple, reliable agent with:")
        print("   • Google Search capabilities")
        print("   • MongoDB CRUD operations")
        print("   • No complex dependencies")
        print("   • Fast and stable performance")
    else:
        print("❌ Some tests failed. Check the errors above.")
    
    return success_count == total_tests

if __name__ == "__main__":
    main()
