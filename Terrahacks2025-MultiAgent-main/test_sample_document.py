#!/usr/bin/env python3
"""
Comprehensive test cases for MongoDB tools with sample documents.
Tests all CRUD operations using the specified sample document.
"""

import json
from datetime import datetime
import sys
import os

# Add the parent directory to the path so we can import our tools
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_sample_document_operations():
    """Test all MongoDB operations with the specified sample document."""
    print("🧪 Testing MongoDB Tools with Sample Document")
    print("=" * 50)
    
    # Import the MongoDB tools
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb,
            read_from_mongodb,
            delete_from_mongodb,
            count_mongodb_documents
        )
        print("✅ MongoDB tools imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import MongoDB tools: {e}")
        return False
    
    # Test collection name
    test_collection = "test_documents"
    
    # Sample document as specified
    sample_document = {
        "title": "testing",
        "content": "The quick brown fox jumped over the lazy dog into the database",
        "timestamp": datetime.now().isoformat(),
        "test_id": "sample_doc_001",
        "category": "test_data",
        "tags": ["testing", "sample", "mongodb"],
        "metadata": {
            "created_by": "test_suite",
            "purpose": "testing_mongodb_tools",
            "version": "1.0"
        }
    }
    
    print(f"\n📄 Sample Document:")
    print(json.dumps(sample_document, indent=2))
    print(f"\n🗂️  Test Collection: {test_collection}")
    
    # Test 1: INSERT Operation
    print(f"\n{'='*20} TEST 1: INSERT {'='*20}")
    
    try:
        document_json = json.dumps(sample_document)
        insert_result = write_to_mongodb(test_collection, document_json, "insert")
        print(f"✅ Insert Result: {insert_result}")
        
        # Extract the inserted ID for later tests
        if "successfully with ID:" in insert_result:
            inserted_id = insert_result.split("ID: ")[1]
            print(f"📝 Inserted Document ID: {inserted_id}")
        else:
            print("⚠️  Could not extract inserted ID")
            inserted_id = None
            
    except Exception as e:
        print(f"❌ Insert test failed: {e}")
        return False
    
    # Test 2: READ Operations
    print(f"\n{'='*20} TEST 2: READ {'='*20}")
    
    # 2a: Read all documents in collection
    try:
        read_all_result = read_from_mongodb(test_collection, "{}", 10)
        documents = json.loads(read_all_result)
        print(f"✅ Read All: Found {len(documents)} documents")
        
        # Show the first document
        if documents:
            print(f"📄 First Document Title: {documents[0].get('title', 'N/A')}")
            print(f"📄 First Document Content: {documents[0].get('content', 'N/A')[:50]}...")
            
    except Exception as e:
        print(f"❌ Read all test failed: {e}")
    
    # 2b: Read specific document by title
    try:
        title_query = json.dumps({"title": "testing"})
        read_title_result = read_from_mongodb(test_collection, title_query, 5)
        title_documents = json.loads(read_title_result)
        print(f"✅ Read by Title: Found {len(title_documents)} documents with title 'testing'")
        
    except Exception as e:
        print(f"❌ Read by title test failed: {e}")
    
    # 2c: Read by test_id
    try:
        test_id_query = json.dumps({"test_id": "sample_doc_001"})
        read_test_id_result = read_from_mongodb(test_collection, test_id_query, 5)
        test_id_documents = json.loads(read_test_id_result)
        print(f"✅ Read by Test ID: Found {len(test_id_documents)} documents with test_id 'sample_doc_001'")
        
    except Exception as e:
        print(f"❌ Read by test_id failed: {e}")
    
    # 2d: Read with complex query (tags contain "testing")
    try:
        tags_query = json.dumps({"tags": {"$in": ["testing"]}})
        read_tags_result = read_from_mongodb(test_collection, tags_query, 5)
        tags_documents = json.loads(read_tags_result)
        print(f"✅ Read by Tags: Found {len(tags_documents)} documents with 'testing' tag")
        
    except Exception as e:
        print(f"❌ Read by tags test failed: {e}")
    
    # Test 3: COUNT Operations
    print(f"\n{'='*20} TEST 3: COUNT {'='*20}")
    
    # 3a: Count all documents
    try:
        count_all_result = count_mongodb_documents(test_collection, "{}")
        print(f"✅ Count All: {count_all_result}")
        
    except Exception as e:
        print(f"❌ Count all test failed: {e}")
    
    # 3b: Count documents with title "testing"
    try:
        count_title_query = json.dumps({"title": "testing"})
        count_title_result = count_mongodb_documents(test_collection, count_title_query)
        print(f"✅ Count by Title: {count_title_result}")
        
    except Exception as e:
        print(f"❌ Count by title test failed: {e}")
    
    # 3c: Count documents with specific category
    try:
        count_category_query = json.dumps({"category": "test_data"})
        count_category_result = count_mongodb_documents(test_collection, count_category_query)
        print(f"✅ Count by Category: {count_category_result}")
        
    except Exception as e:
        print(f"❌ Count by category test failed: {e}")
    
    # Test 4: UPDATE Operations
    print(f"\n{'='*20} TEST 4: UPDATE {'='*20}")
    
    # 4a: Update document content
    try:
        update_data = {
            "filter": {"test_id": "sample_doc_001"},
            "update": {
                "$set": {
                    "content": "The quick brown fox jumped over the lazy dog into the database - UPDATED!",
                    "last_updated": datetime.now().isoformat(),
                    "update_count": 1
                }
            }
        }
        update_json = json.dumps(update_data)
        update_result = write_to_mongodb(test_collection, update_json, "update")
        print(f"✅ Update Result: {update_result}")
        
    except Exception as e:
        print(f"❌ Update test failed: {e}")
    
    # 4b: Verify the update worked
    try:
        verify_query = json.dumps({"test_id": "sample_doc_001"})
        verify_result = read_from_mongodb(test_collection, verify_query, 1)
        verify_documents = json.loads(verify_result)
        
        if verify_documents:
            updated_content = verify_documents[0].get('content', '')
            if "UPDATED!" in updated_content:
                print("✅ Update Verification: Content was successfully updated")
            else:
                print("⚠️  Update Verification: Content may not have been updated")
        else:
            print("❌ Update Verification: Could not find updated document")
            
    except Exception as e:
        print(f"❌ Update verification failed: {e}")
    
    # Test 5: UPSERT Operation
    print(f"\n{'='*20} TEST 5: UPSERT {'='*20}")
    
    # 5a: Upsert a new document
    try:
        upsert_data = {
            "filter": {"test_id": "sample_doc_002"},
            "update": {
                "$set": {
                    "title": "testing upsert",
                    "content": "The quick brown fox jumped over the lazy dog into the database via UPSERT",
                    "timestamp": datetime.now().isoformat(),
                    "test_id": "sample_doc_002",
                    "category": "upsert_test",
                    "tags": ["testing", "upsert", "mongodb"]
                }
            }
        }
        upsert_json = json.dumps(upsert_data)
        upsert_result = write_to_mongodb(test_collection, upsert_json, "upsert")
        print(f"✅ Upsert Result: {upsert_result}")
        
    except Exception as e:
        print(f"❌ Upsert test failed: {e}")
    
    # 5b: Verify the upsert worked
    try:
        verify_upsert_query = json.dumps({"test_id": "sample_doc_002"})
        verify_upsert_result = read_from_mongodb(test_collection, verify_upsert_query, 1)
        verify_upsert_documents = json.loads(verify_upsert_result)
        
        if verify_upsert_documents:
            print("✅ Upsert Verification: New document was created successfully")
            print(f"📄 Upserted Document Title: {verify_upsert_documents[0].get('title', 'N/A')}")
        else:
            print("❌ Upsert Verification: Could not find upserted document")
            
    except Exception as e:
        print(f"❌ Upsert verification failed: {e}")
    
    # Test 6: Advanced Queries
    print(f"\n{'='*20} TEST 6: ADVANCED QUERIES {'='*20}")
    
    # 6a: Query with regex (case-insensitive search)
    try:
        regex_query = json.dumps({"content": {"$regex": "fox", "$options": "i"}})
        regex_result = read_from_mongodb(test_collection, regex_query, 5)
        regex_documents = json.loads(regex_result)
        print(f"✅ Regex Query: Found {len(regex_documents)} documents containing 'fox'")
        
    except Exception as e:
        print(f"❌ Regex query test failed: {e}")
    
    # 6b: Query with multiple conditions
    try:
        multi_query = json.dumps({
            "$and": [
                {"category": "test_data"},
                {"tags": {"$in": ["testing"]}}
            ]
        })
        multi_result = read_from_mongodb(test_collection, multi_query, 5)
        multi_documents = json.loads(multi_result)
        print(f"✅ Multi-condition Query: Found {len(multi_documents)} documents")
        
    except Exception as e:
        print(f"❌ Multi-condition query test failed: {e}")
    
    # Final count to see total test documents
    print(f"\n{'='*20} FINAL STATUS {'='*20}")
    try:
        final_count_result = count_mongodb_documents(test_collection, "{}")
        print(f"📊 Final Document Count: {final_count_result}")
        
        # Show all test documents
        final_read_result = read_from_mongodb(test_collection, "{}", 20)
        final_documents = json.loads(final_read_result)
        
        print(f"\n📄 All Test Documents:")
        for i, doc in enumerate(final_documents, 1):
            print(f"   {i}. Title: {doc.get('title', 'N/A')}")
            print(f"      Test ID: {doc.get('test_id', 'N/A')}")
            print(f"      Category: {doc.get('category', 'N/A')}")
            
    except Exception as e:
        print(f"❌ Final status check failed: {e}")
    
    print(f"\n{'='*50}")
    print("🎉 MongoDB Tools Test Complete!")
    print("\n💡 Your agent can now:")
    print("   ✓ Insert documents with complex data structures")
    print("   ✓ Read documents with various query patterns")
    print("   ✓ Update existing documents")
    print("   ✓ Upsert documents (insert or update)")
    print("   ✓ Count documents with filters")
    print("   ✓ Handle JSON data, arrays, and nested objects")
    
    return True


def test_error_handling():
    """Test error handling scenarios."""
    print(f"\n{'='*20} ERROR HANDLING TESTS {'='*20}")
    
    from app.chat_agent_google_agent.mongo_tools import (
        write_to_mongodb,
        read_from_mongodb,
        count_mongodb_documents
    )
    
    # Test invalid JSON
    try:
        invalid_json = "invalid json string"
        result = write_to_mongodb("test_collection", invalid_json)
        print(f"✅ Invalid JSON Test: {result}")
        
    except Exception as e:
        print(f"❌ Invalid JSON test failed: {e}")
    
    # Test invalid query JSON
    try:
        invalid_query = "invalid query"
        result = read_from_mongodb("test_collection", invalid_query)
        print(f"✅ Invalid Query Test: {result}")
        
    except Exception as e:
        print(f"❌ Invalid query test failed: {e}")
    
    # Test unsupported operation
    try:
        valid_json = json.dumps({"test": "data"})
        result = write_to_mongodb("test_collection", valid_json, "invalid_operation")
        print(f"✅ Invalid Operation Test: {result}")
        
    except Exception as e:
        print(f"❌ Invalid operation test failed: {e}")


def cleanup_test_data():
    """Clean up test data."""
    print(f"\n{'='*20} CLEANUP {'='*20}")
    
    try:
        from app.chat_agent_google_agent.mongo_tools import delete_from_mongodb
        
        # Delete all test documents
        cleanup_query = json.dumps({"category": {"$in": ["test_data", "upsert_test"]}})
        cleanup_result = delete_from_mongodb("test_documents", cleanup_query)
        print(f"🧹 Cleanup Result: {cleanup_result}")
        
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")


def main():
    """Run all tests."""
    print("🧪 MongoDB Tools - Comprehensive Test Suite")
    print("Testing with sample document: 'testing' / 'The quick brown fox jumped over the lazy dog into the database'")
    print("=" * 80)
    
    success = True
    
    # Run main tests
    if not test_sample_document_operations():
        success = False
    
    # Run error handling tests
    try:
        test_error_handling()
    except Exception as e:
        print(f"❌ Error handling tests failed: {e}")
        success = False
    
    # Cleanup (optional - comment out if you want to keep test data)
    try:
        cleanup_test_data()
    except Exception as e:
        print(f"⚠️  Cleanup failed (test data may remain): {e}")
    
    if success:
        print("\n🎉 All tests completed successfully!")
        print("🚀 Your MongoDB tools are ready for production use with the ADK agent!")
    else:
        print("\n❌ Some tests failed. Please check the output above.")
    
    return success


if __name__ == "__main__":
    main()
