#!/usr/bin/env python3
"""
Comprehensive integration test for MongoDB Tools Agent.
Tests individual tools and simulates real agent workflows.
"""

import sys
import os
import json
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_mongodb_tools_comprehensive():
    """Comprehensive test of all MongoDB tools with real-world scenarios."""
    print("🔧 Comprehensive MongoDB Tools Test")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb, 
            read_from_mongodb, 
            count_mongodb_documents, 
            delete_from_mongodb
        )
        
        test_collection = "integration_test"
        success_count = 0
        total_tests = 12
        
        # Test 1: Insert a research document
        print("📝 Test 1: Insert research document")
        research_doc = {
            "title": "AI Research Findings",
            "content": "Latest developments in artificial intelligence and machine learning",
            "source": "Research Study 2025",
            "date": datetime.now().isoformat(),
            "tags": ["AI", "machine learning", "research"],
            "category": "research"
        }
        result = write_to_mongodb(test_collection, json.dumps(research_doc))
        print(f"   Result: {result}")
        if "successfully" in result:
            success_count += 1
        
        # Test 2: Insert a news article
        print("\n📰 Test 2: Insert news article")
        news_doc = {
            "title": "Tech Industry News",
            "content": "Breaking news about technology companies and innovations",
            "source": "Tech News Daily",
            "date": datetime.now().isoformat(),
            "tags": ["technology", "news", "innovation"],
            "category": "news"
        }
        result = write_to_mongodb(test_collection, json.dumps(news_doc))
        print(f"   Result: {result}")
        if "successfully" in result:
            success_count += 1
        
        # Test 3: Count all documents
        print("\n📊 Test 3: Count all documents")
        count_result = count_mongodb_documents(test_collection, "{}")
        print(f"   Result: {count_result}")
        if "Found" in count_result:
            success_count += 1
        
        # Test 4: Count documents by category
        print("\n🏷️ Test 4: Count research documents")
        research_count = count_mongodb_documents(test_collection, '{"category": "research"}')
        print(f"   Result: {research_count}")
        if "Found" in research_count:
            success_count += 1
        
        # Test 5: Read all documents
        print("\n📖 Test 5: Read all documents")
        all_docs = read_from_mongodb(test_collection, "{}", 10)
        print(f"   Result: Found {len(json.loads(all_docs))} documents")
        if "[" in all_docs:
            success_count += 1
        
        # Test 6: Search by title pattern
        print("\n🔍 Test 6: Search by title pattern")
        ai_docs = read_from_mongodb(test_collection, '{"title": {"$regex": "AI", "$options": "i"}}', 5)
        print(f"   Result: {ai_docs[:100]}...")
        if "[" in ai_docs:
            success_count += 1
        
        # Test 7: Search by tags
        print("\n🏷️ Test 7: Search by tags")
        tagged_docs = read_from_mongodb(test_collection, '{"tags": {"$in": ["AI", "technology"]}}', 5)
        print(f"   Result: {tagged_docs[:100]}...")
        if "[" in tagged_docs:
            success_count += 1
        
        # Test 8: Update document with new information
        print("\n✏️ Test 8: Update research document")
        update_doc = {
            "filter": {"category": "research"},
            "update": {
                "$set": {
                    "updated": True,
                    "last_modified": datetime.now().isoformat(),
                    "status": "reviewed"
                }
            }
        }
        update_result = write_to_mongodb(test_collection, json.dumps(update_doc), "update")
        print(f"   Result: {update_result}")
        if "Updated" in update_result:
            success_count += 1
        
        # Test 9: Upsert operation (insert if doesn't exist, update if exists)
        print("\n🔄 Test 9: Upsert operation")
        upsert_doc = {
            "filter": {"title": "Unique Research Paper"},
            "update": {
                "$set": {
                    "title": "Unique Research Paper",
                    "content": "This document was created via upsert",
                    "category": "research",
                    "created_via": "upsert",
                    "date": datetime.now().isoformat()
                }
            }
        }
        upsert_result = write_to_mongodb(test_collection, json.dumps(upsert_doc), "upsert")
        print(f"   Result: {upsert_result}")
        if "upserted" in upsert_result or "updated" in upsert_result:
            success_count += 1
        
        # Test 10: Count after updates
        print("\n📊 Test 10: Count after updates")
        final_count = count_mongodb_documents(test_collection)
        print(f"   Result: {final_count}")
        if "Found" in final_count:
            success_count += 1
        
        # Test 11: Delete specific documents
        print("\n🗑️ Test 11: Delete test documents")
        delete_result = delete_from_mongodb(test_collection, '{"created_via": "upsert"}')
        print(f"   Result: {delete_result}")
        if "Deleted" in delete_result:
            success_count += 1
        
        # Test 12: Verify deletion
        print("\n✅ Test 12: Verify deletion")
        verify_count = count_mongodb_documents(test_collection, '{"created_via": "upsert"}')
        print(f"   Result: {verify_count}")
        if "Found 0" in verify_count:
            success_count += 1
        
        print(f"\n📊 Comprehensive MongoDB test: {success_count}/{total_tests} passed")
        return success_count == total_tests
        
    except Exception as e:
        print(f"❌ Comprehensive MongoDB test failed: {e}")
        return False

def test_agent_workflow_simulation():
    """Simulate a real agent workflow: research → store → retrieve → analyze."""
    print("\n🤖 Agent Workflow Simulation")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb, 
            read_from_mongodb, 
            count_mongodb_documents
        )
        
        workflow_collection = "agent_workflow_test"
        
        # Simulate research findings storage
        research_topics = [
            {
                "topic": "Quantum Computing Advances",
                "findings": "Recent breakthroughs in quantum error correction",
                "source": "Nature Quantum",
                "confidence": 0.9,
                "date": datetime.now().isoformat(),
                "category": "quantum_research"
            },
            {
                "topic": "AI Ethics Guidelines", 
                "findings": "New regulatory frameworks for AI development",
                "source": "IEEE Standards",
                "confidence": 0.85,
                "date": datetime.now().isoformat(),
                "category": "ai_ethics"
            },
            {
                "topic": "Sustainable Technology",
                "findings": "Green computing and energy-efficient algorithms",
                "source": "Green Tech Journal",
                "confidence": 0.8,
                "date": datetime.now().isoformat(),
                "category": "sustainability"
            }
        ]
        
        print("📚 Step 1: Store research findings")
        stored_count = 0
        for research in research_topics:
            result = write_to_mongodb(workflow_collection, json.dumps(research))
            if "successfully" in result:
                stored_count += 1
                print(f"   ✅ Stored: {research['topic']}")
        
        print(f"\n📊 Step 2: Verify storage - {stored_count} documents stored")
        total_count = count_mongodb_documents(workflow_collection)
        print(f"   {total_count}")
        
        print("\n🔍 Step 3: Retrieve by category")
        ai_research = read_from_mongodb(workflow_collection, '{"category": "ai_ethics"}', 5)
        ai_docs = json.loads(ai_research)
        print(f"   Found {len(ai_docs)} AI ethics documents")
        
        print("\n📈 Step 4: High-confidence research")
        high_conf = read_from_mongodb(workflow_collection, '{"confidence": {"$gte": 0.85}}', 10)
        conf_docs = json.loads(high_conf)
        print(f"   Found {len(conf_docs)} high-confidence research items")
        
        print("\n📊 Step 5: Research summary by category")
        categories = ["quantum_research", "ai_ethics", "sustainability"]
        for category in categories:
            cat_count = count_mongodb_documents(workflow_collection, f'{{"category": "{category}"}}')
            print(f"   {category}: {cat_count}")
        
        workflow_success = stored_count == 3 and len(ai_docs) >= 1 and len(conf_docs) >= 2
        
        if workflow_success:
            print("\n✅ Agent workflow simulation successful!")
            return True
        else:
            print("\n❌ Agent workflow simulation failed")
            return False
        
    except Exception as e:
        print(f"❌ Agent workflow simulation failed: {e}")
        return False

def test_error_handling():
    """Test error handling for various edge cases."""
    print("\n⚠️ Error Handling Tests")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb, 
            read_from_mongodb, 
            delete_from_mongodb
        )
        
        success_count = 0
        total_tests = 4
        
        # Test 1: Invalid JSON
        print("🚫 Test 1: Invalid JSON handling")
        result = write_to_mongodb("error_test", "invalid json string")
        print(f"   Result: {result}")
        if "Invalid JSON" in result:
            success_count += 1
        
        # Test 2: Invalid query format
        print("\n🚫 Test 2: Invalid query format")
        result = read_from_mongodb("error_test", "invalid query")
        print(f"   Result: {result}")
        if "Invalid JSON" in result:
            success_count += 1
        
        # Test 3: Missing fields for update
        print("\n🚫 Test 3: Missing update fields")
        result = write_to_mongodb("error_test", '{"data": "test"}', "update")
        print(f"   Result: {result}")
        if "must contain 'filter' and 'update'" in result:
            success_count += 1
        
        # Test 4: Invalid operation type
        print("\n🚫 Test 4: Invalid operation type")
        result = write_to_mongodb("error_test", '{"data": "test"}', "invalid_op")
        print(f"   Result: {result}")
        if "Unsupported operation" in result:
            success_count += 1
        
        print(f"\n📊 Error handling test: {success_count}/{total_tests} passed")
        return success_count == total_tests
        
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def test_agent_integration():
    """Test that the agent has all tools properly integrated."""
    print("\n🔗 Agent Integration Test")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.agent import unified_agent
        
        # Verify agent properties
        assert unified_agent.name == "mongo_db_tools_agent"
        assert unified_agent.model == "gemini-2.0-flash-live-001"
        assert len(unified_agent.tools) == 5  # Google Search + 4 MongoDB tools
        
        # Verify all MongoDB tools are present
        tool_names = [getattr(tool, '__name__', str(tool)) for tool in unified_agent.tools]
        
        required_tools = [
            'write_to_mongodb',
            'read_from_mongodb', 
            'delete_from_mongodb',
            'count_mongodb_documents'
        ]
        
        mongodb_tools_present = all(tool in tool_names for tool in required_tools)
        google_search_present = any('google' in str(tool).lower() for tool in unified_agent.tools)
        
        print(f"✅ Agent name: {unified_agent.name}")
        print(f"✅ Agent model: {unified_agent.model}")
        print(f"✅ Total tools: {len(unified_agent.tools)}")
        print(f"✅ MongoDB tools present: {mongodb_tools_present}")
        print(f"✅ Google Search present: {google_search_present}")
        print(f"✅ Instructions length: {len(unified_agent.instruction)} characters")
        
        integration_success = (
            mongodb_tools_present and 
            google_search_present and 
            len(unified_agent.tools) == 5
        )
        
        if integration_success:
            print("\n✅ Agent integration test passed!")
            return True
        else:
            print("\n❌ Agent integration test failed!")
            return False
        
    except Exception as e:
        print(f"❌ Agent integration test failed: {e}")
        return False

def cleanup_test_data():
    """Clean up test data from the database."""
    print("\n🧹 Cleaning up test data")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.mongo_tools import delete_from_mongodb, count_mongodb_documents
        
        test_collections = ["integration_test", "agent_workflow_test", "error_test"]
        
        for collection in test_collections:
            # Count before cleanup
            before_count = count_mongodb_documents(collection)
            print(f"   {collection}: {before_count}")
            
            # Delete test documents
            delete_result = delete_from_mongodb(collection, '{}')
            print(f"   Cleanup result: {delete_result}")
        
        print("✅ Test data cleanup completed")
        return True
        
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")
        return False

def main():
    """Run comprehensive integration tests."""
    print("🧪 MongoDB Tools Agent - Comprehensive Integration Test")
    print("=" * 80)
    print(f"Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    success_count = 0
    total_test_suites = 5
    
    # Test Suite 1: Comprehensive MongoDB tools
    if test_mongodb_tools_comprehensive():
        success_count += 1
    
    # Test Suite 2: Agent workflow simulation
    if test_agent_workflow_simulation():
        success_count += 1
    
    # Test Suite 3: Error handling
    if test_error_handling():
        success_count += 1
    
    # Test Suite 4: Agent integration
    if test_agent_integration():
        success_count += 1
    
    # Test Suite 5: Cleanup
    if cleanup_test_data():
        success_count += 1
    
    # Final Results
    print("\n" + "=" * 80)
    print(f"🏁 Integration Test Results: {success_count}/{total_test_suites} test suites passed")
    
    if success_count == total_test_suites:
        print("🎉 All integration tests passed! MongoDB Tools Agent is fully functional.")
        print()
        print("🚀 Ready for production use:")
        print("   • All MongoDB operations working correctly")
        print("   • Error handling properly implemented")  
        print("   • Agent integration verified")
        print("   • Workflow simulations successful")
        print()
        print("💡 To start the agent:")
        print("   adk web")
        print("   Select: 'mongo_db_tools_agent'")
    else:
        print("❌ Some integration tests failed. Please review the errors above.")
    
    return success_count == total_test_suites

if __name__ == "__main__":
    main()
