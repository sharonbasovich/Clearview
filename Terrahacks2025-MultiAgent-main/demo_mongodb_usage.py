#!/usr/bin/env python3
"""
MongoDB Tools Agent Usage Examples
Demonstrates how to use the MongoDB tools in practice.
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

def demonstrate_basic_operations():
    """Demonstrate basic MongoDB operations."""
    print("🎯 MongoDB Tools Usage Examples")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.mongo_tools import (
            write_to_mongodb, 
            read_from_mongodb, 
            delete_from_mongodb, 
            count_mongodb_documents
        )
        
        collection_name = "demo_collection"
        
        print("📝 Example 1: Storing research data")
        research_data = {
            "title": "AI Research Summary",
            "content": "Latest findings on artificial intelligence and machine learning trends",
            "source": "Tech Research Institute",
            "date": datetime.now().isoformat(),
            "tags": ["AI", "machine learning", "research"],
            "category": "research"
        }
        
        # Insert the document
        result = write_to_mongodb(collection_name, json.dumps(research_data))
        print(f"   Result: {result}")
        
        print("\n📊 Example 2: Counting stored documents")
        count_result = count_mongodb_documents(collection_name)
        print(f"   Result: {count_result}")
        
        print("\n🔍 Example 3: Querying by category")
        query = '{"category": "research"}'
        query_result = read_from_mongodb(collection_name, query, 5)
        docs = json.loads(query_result)
        print(f"   Found {len(docs)} research documents")
        
        print("\n✏️ Example 4: Updating documents")
        update_data = {
            "filter": {"category": "research"},
            "update": {
                "$set": {
                    "status": "reviewed",
                    "last_updated": datetime.now().isoformat()
                }
            }
        }
        update_result = write_to_mongodb(collection_name, json.dumps(update_data), "update")
        print(f"   Result: {update_result}")
        
        print("\n🔍 Example 5: Advanced querying")
        # Query for documents with specific tags
        tag_query = '{"tags": {"$in": ["AI", "machine learning"]}}'
        tag_result = read_from_mongodb(collection_name, tag_query, 3)
        tag_docs = json.loads(tag_result)
        print(f"   Found {len(tag_docs)} documents with AI/ML tags")
        
        print("\n🧹 Example 6: Cleanup - delete demo documents")
        delete_result = delete_from_mongodb(collection_name, '{"category": "research"}')
        print(f"   Result: {delete_result}")
        
        print("\n✅ All examples completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Examples failed: {e}")
        return False

def show_agent_capabilities():
    """Show the agent's complete capabilities."""
    print("\n🤖 Agent Capabilities Summary")
    print("=" * 50)
    
    try:
        from app.chat_agent_google_agent.agent import unified_agent
        
        print(f"🏷️ Agent Name: {unified_agent.name}")
        print(f"🧠 Model: {unified_agent.model}")
        print(f"📝 Description: {unified_agent.description}")
        
        print(f"\n🔧 Available Tools ({len(unified_agent.tools)} total):")
        for i, tool in enumerate(unified_agent.tools, 1):
            tool_name = getattr(tool, '__name__', str(tool))
            if 'google' in str(tool).lower():
                print(f"   {i}. 🔍 {tool_name} (Google Search)")
            else:
                print(f"   {i}. 💾 {tool_name} (MongoDB)")
        
        print("\n💡 Usage Patterns:")
        print("   1. Research Workflow:")
        print("      • Use google_search to find information")
        print("      • Use write_to_mongodb to store findings")
        print("      • Use read_from_mongodb to retrieve stored data")
        
        print("\n   2. Data Management:")
        print("      • Use count_mongodb_documents to check collection size")
        print("      • Use read_from_mongodb with queries to filter data")
        print("      • Use write_to_mongodb with 'update' to modify existing data")
        print("      • Use delete_from_mongodb to clean up old data")
        
        print("\n🚀 Ready to start the agent:")
        print("   adk web")
        print("   Select: 'mongo_db_tools_agent'")
        
        return True
        
    except Exception as e:
        print(f"❌ Agent capabilities check failed: {e}")
        return False

def main():
    """Run usage examples and show capabilities."""
    print("📚 MongoDB Tools Agent - Usage Guide")
    print("=" * 60)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    success_count = 0
    total_demos = 2
    
    # Demo 1: Basic operations
    if demonstrate_basic_operations():
        success_count += 1
    
    # Demo 2: Agent capabilities
    if show_agent_capabilities():
        success_count += 1
    
    # Results
    print("\n" + "=" * 60)
    print(f"🏁 Demo Results: {success_count}/{total_demos} demonstrations completed")
    
    if success_count == total_demos:
        print("🎉 MongoDB Tools Agent Usage Guide completed successfully!")
        print("\n✨ Key takeaways:")
        print("   • MongoDB tools are working correctly")
        print("   • Agent integration is complete")
        print("   • All CRUD operations are available")
        print("   • Ready for production use")
    else:
        print("❌ Some demonstrations failed.")
    
    return success_count == total_demos

if __name__ == "__main__":
    main()
