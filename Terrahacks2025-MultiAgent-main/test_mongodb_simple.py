#!/usr/bin/env python3
"""
Simple MongoDB operations test suite.
Tests: Insert → Query → Delete → Verify deletion
"""

import sys
import os
import json
from datetime import datetime

# Load environment variables from .env file manually
def load_env_file():
    """Load environment variables from .env file."""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
                    
load_env_file()

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_environment_variables():
    """Test that environment variables are properly loaded."""
    print("🌍 Environment Variables Check")
    print("=" * 50)
    
    mongodb_conn = os.getenv("MONGODB_CONNECTION_STRING")
    mongodb_db = os.getenv("MONGODB_DATABASE_NAME") 
    
    print(f"✅ MONGODB_CONNECTION_STRING: {'✓ Set' if mongodb_conn else '❌ Not set'}")
    print(f"✅ MONGODB_DATABASE_NAME: {'✓ Set' if mongodb_db else '❌ Not set'}")
    
    if mongodb_conn:
        # Don't print the full connection string for security
        print(f"   Connection string starts with: {mongodb_conn[:20]}...")
    
    if mongodb_db:
        print(f"   Database name: {mongodb_db}")
    
    return bool(mongodb_conn and mongodb_db)

def test_mongodb_operations():
    """Test MongoDB operations: Insert → Query → Delete → Verify."""
    print("🧪 MongoDB Operations Test Suite")
    print("Testing: Insert → Query → Delete → Verify")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb, 
            read_from_mongodb, 
            delete_from_mongodb, 
            count_mongodb_documents
        )
        
        test_collection = "test_operations"
        success_count = 0
        total_tests = 4
        
        # Test document: "The quick brown fox jumped over the lazy dog"
        test_document = {
            "title": "Test Document",
            "content": "The quick brown fox jumped over the lazy dog",
            "timestamp": datetime.now().isoformat(),
            "test_marker": "mongodb_test_document"
        }
        
        # Step 1: Insert the test document
        print("📝 Step 1: Insert test document")
        print(f"   Content: {test_document['content']}")
        insert_result = write_to_mongodb(test_collection, json.dumps(test_document))
        print(f"   Result: {insert_result}")
        
        if "successfully" in insert_result:
            success_count += 1
            print("   ✅ Insert successful")
        else:
            print("   ❌ Insert failed")
        
        # Step 2: Query for the document
        print("\n🔍 Step 2: Query for the test document")
        query = '{"test_marker": "mongodb_test_document"}'
        query_result = read_from_mongodb(test_collection, query, 5)
        print(f"   Query: {query}")
        
        try:
            found_docs = json.loads(query_result)
            if len(found_docs) > 0:
                print(f"   Found: {len(found_docs)} document(s)")
                # Check if our content is in the results
                found_content = False
                for doc in found_docs:
                    if "The quick brown fox jumped over the lazy dog" in doc.get("content", ""):
                        found_content = True
                        print(f"   Content verified: {doc['content']}")
                        break
                
                if found_content:
                    success_count += 1
                    print("   ✅ Query successful - document found")
                else:
                    print("   ❌ Query failed - content not found")
            else:
                print("   ❌ Query failed - no documents found")
        except json.JSONDecodeError:
            print(f"   ❌ Query failed - invalid response: {query_result}")
        
        # Step 3: Delete the test document
        print("\n🗑️ Step 3: Delete the test document")
        delete_query = '{"test_marker": "mongodb_test_document"}'
        delete_result = delete_from_mongodb(test_collection, delete_query)
        print(f"   Delete query: {delete_query}")
        print(f"   Result: {delete_result}")
        
        if "Deleted" in delete_result and "0" not in delete_result:
            success_count += 1
            print("   ✅ Delete successful")
        else:
            print("   ❌ Delete failed or no documents deleted")
        
        # Step 4: Verify deletion
        print("\n✅ Step 4: Verify document is deleted")
        verify_query = '{"test_marker": "mongodb_test_document"}'
        verify_result = read_from_mongodb(test_collection, verify_query, 5)
        print(f"   Verification query: {verify_query}")
        
        try:
            remaining_docs = json.loads(verify_result)
            if len(remaining_docs) == 0:
                success_count += 1
                print("   ✅ Verification successful - document deleted")
                print("   Result: No documents found (as expected)")
            else:
                print(f"   ❌ Verification failed - {len(remaining_docs)} documents still exist")
        except json.JSONDecodeError:
            print(f"   ❌ Verification failed - invalid response: {verify_result}")
        
        # Final results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {success_count}/{total_tests} operations successful")
        
        if success_count == total_tests:
            print("🎉 All MongoDB operations completed successfully!")
            print("\n✅ Test Summary:")
            print("   • Document inserted with 'The quick brown fox jumped over the lazy dog'")
            print("   • Document successfully queried and found")
            print("   • Document successfully deleted")
            print("   • Deletion verified - no remaining documents")
        else:
            print("❌ Some MongoDB operations failed. Check the results above.")
        
        return success_count == total_tests
        
    except Exception as e:
        print(f"❌ MongoDB operations test failed with exception: {e}")
        return False

def test_agent_tools_integration():
    """Verify that the agent has the MongoDB tools properly integrated."""
    print("\n🔗 Agent Tools Integration Check")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.agent import unified_agent
        from app.chat_agent_google_agent.mongo_tools import MONGODB_TOOLS
        
        # Check agent properties
        print(f"✅ Agent name: {unified_agent.name}")
        print(f"✅ Agent model: {unified_agent.model}")
        print(f"✅ Total tools: {len(unified_agent.tools)}")
        
        # Check MongoDB tools are included
        tool_names = [getattr(tool, '__name__', str(tool)) for tool in unified_agent.tools]
        
        mongodb_tool_names = [tool.__name__ for tool in MONGODB_TOOLS]
        print(f"\n🔧 MongoDB Tools in Agent:")
        
        all_tools_present = True
        for tool_name in mongodb_tool_names:
            if tool_name in tool_names:
                print(f"   ✅ {tool_name}")
            else:
                print(f"   ❌ {tool_name} - MISSING")
                all_tools_present = False
        
        # Check for Google Search
        google_search_present = any('google' in str(tool).lower() for tool in unified_agent.tools)
        print(f"\n🔍 Google Search: {'✅ Present' if google_search_present else '❌ Missing'}")
        
        if all_tools_present and google_search_present:
            print("\n✅ Agent integration verified - all tools properly integrated")
            return True
        else:
            print("\n❌ Agent integration failed - missing tools")
            return False
            
    except Exception as e:
        print(f"❌ Agent integration check failed: {e}")
        return False

def main():
    """Run the MongoDB operations test suite."""
    print("🔬 MongoDB Tools Test Suite")
    print("Focus: MongoDB CRUD Operations Only")
    print("Test Case: 'The quick brown fox jumped over the lazy dog'")
    print("=" * 60)
    print(f"Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    success_count = 0
    total_test_suites = 3
    
    # Test Suite 0: Environment variables
    if test_environment_variables():
        success_count += 1
    
    # Test Suite 1: MongoDB operations
    if test_mongodb_operations():
        success_count += 1
    
    # Test Suite 2: Agent integration
    if test_agent_tools_integration():
        success_count += 1
    
    # Final Results
    print("\n" + "=" * 60)
    print(f"🏁 Final Results: {success_count}/{total_test_suites} test suites passed")
    
    if success_count == total_test_suites:
        print("🎉 MongoDB Tools Test Suite PASSED!")
        print("\n✅ Verified:")
        print("   • Environment variables loaded correctly")
        print("   • MongoDB connection working")
        print("   • Insert operation successful")
        print("   • Query operation successful")
        print("   • Delete operation successful")
        print("   • Deletion verification successful")
        print("   • Agent tools integration verified")
        print("\n🚀 MongoDB Tools Agent is ready for use!")
    else:
        print("❌ MongoDB Tools Test Suite FAILED!")
        print("   Please check the errors above and fix any issues.")
    
    return success_count == total_test_suites

if __name__ == "__main__":
    main()
