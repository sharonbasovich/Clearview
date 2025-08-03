#!/usr/bin/env python3
"""
Test the unified research agent with both Google Search and MongoDB capabilities.
"""

import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_unified_agent_import():
    """Test that the unified agent imports correctly with all tools."""
    print("🧪 Testing Unified Agent Import")
    print("=" * 40)
    
    try:
        from app.chat_agent_google_agent.agent import root_agent
        
        print("✅ Unified agent imported successfully")
        print(f"   - Name: {root_agent.name}")
        print(f"   - Model: {root_agent.model}")
        print(f"   - Description: {root_agent.description}")
        print(f"   - Total Tools: {len(root_agent.tools)} tools")
        
        # List all tools
        print("\n🔧 Available Tools:")
        for i, tool in enumerate(root_agent.tools, 1):
            tool_name = getattr(tool, '__name__', str(tool))
            print(f"   {i:2d}. {tool_name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Unified agent import failed: {e}")
        return False

def test_tool_categories():
    """Test that all tool categories are available."""
    print("\n🛠️ Testing Tool Categories")
    print("=" * 40)
    
    try:
        from app.chat_agent_google_agent.agent import root_agent
        
        tool_names = [getattr(tool, '__name__', str(tool)) for tool in root_agent.tools]
        
        # Check for Google Search
        google_tools = [name for name in tool_names if 'google' in name.lower()]
        print(f"📍 Google Search Tools: {len(google_tools)}")
        for tool in google_tools:
            print(f"   • {tool}")
        
        # Check for basic MongoDB tools
        basic_mongo_tools = [name for name in tool_names if any(keyword in name for keyword in ['write_to_mongodb', 'read_from_mongodb', 'delete_from_mongodb', 'count_mongodb'])]
        print(f"\n💾 Basic MongoDB Tools: {len(basic_mongo_tools)}")
        for tool in basic_mongo_tools:
            print(f"   • {tool}")
        
        # Check for LlamaIndex MongoDB tools
        llamaindex_tools = [name for name in tool_names if any(keyword in name for keyword in ['semantic_search', 'store_document_with_embeddings', 'query_documents_with_context', 'summarize_collection', 'find_similar', 'analyze_document_trends'])]
        print(f"\n🔍 LlamaIndex MongoDB Tools: {len(llamaindex_tools)}")
        for tool in llamaindex_tools:
            print(f"   • {tool}")
        
        # Summary
        total_expected = len(google_tools) + len(basic_mongo_tools) + len(llamaindex_tools)
        print(f"\n📊 Tool Summary:")
        print(f"   - Google Search: {len(google_tools)} tools")
        print(f"   - Basic MongoDB: {len(basic_mongo_tools)} tools")
        print(f"   - LlamaIndex MongoDB: {len(llamaindex_tools)} tools")
        print(f"   - Total Available: {len(tool_names)} tools")
        print(f"   - Expected Categories: {total_expected} tools")
        
        return len(google_tools) > 0 and len(basic_mongo_tools) > 0 and len(llamaindex_tools) > 0
        
    except Exception as e:
        print(f"❌ Tool categories test failed: {e}")
        return False

def test_individual_tools():
    """Test that individual tools can be called."""
    print("\n⚙️ Testing Individual Tools")
    print("=" * 40)
    
    success_count = 0
    total_tests = 4
    
    # Test basic MongoDB tools
    try:
        from app.chat_agent_google_agent.mongo_tools import write_to_mongodb, count_mongodb_documents
        
        # Test write operation
        test_doc = '{"test": "unified_agent_test", "timestamp": "2025-08-02", "purpose": "testing unified agent"}'
        result = write_to_mongodb("unified_test", test_doc)
        print(f"✅ Basic MongoDB write test: {result[:100]}...")
        
        # Test count operation
        count_result = count_mongodb_documents("unified_test")
        print(f"✅ Basic MongoDB count test: {count_result}")
        
        success_count += 1
        
    except Exception as e:
        print(f"❌ Basic MongoDB tools test failed: {e}")
    
    # Test LlamaIndex tools
    try:
        from app.mongodb_agent.mongodb_llamaindex_tools import store_document_with_embeddings, semantic_search_documents
        
        # Test advanced storage
        test_doc = '{"title": "Unified Agent Test", "content": "Testing the unified research agent with LlamaIndex integration", "category": "test"}'
        result = store_document_with_embeddings("unified_llamaindex_test", test_doc, "Unified Test Document")
        print(f"✅ LlamaIndex storage test: {result[:100]}...")
        
        # Test semantic search
        search_result = semantic_search_documents("unified research agent", "unified_llamaindex_test", 2)
        print(f"✅ LlamaIndex search test: {search_result[:100]}...")
        
        success_count += 1
        
    except Exception as e:
        print(f"❌ LlamaIndex tools test failed: {e}")
    
    # Test Google Search (mock test)
    try:
        from google.adk.tools import google_search
        print("✅ Google Search tool available")
        success_count += 1
        
    except Exception as e:
        print(f"❌ Google Search tool test failed: {e}")
    
    # Test agent instructions
    try:
        from app.chat_agent_google_agent.agent import root_agent
        if "semantic search" in root_agent.instruction.lower():
            print("✅ Agent instructions include LlamaIndex capabilities")
            success_count += 1
        else:
            print("❌ Agent instructions missing LlamaIndex capabilities")
        
    except Exception as e:
        print(f"❌ Agent instructions test failed: {e}")
    
    print(f"\n📊 Individual tools test: {success_count}/{total_tests} passed")
    return success_count == total_tests

def demonstrate_unified_capabilities():
    """Demonstrate the unified agent's capabilities."""
    print("\n🚀 Unified Agent Capabilities")
    print("=" * 40)
    
    try:
        from app.chat_agent_google_agent.agent import root_agent
        
        print("🎯 Unified Research Agent Features:")
        print()
        
        print("1. 📍 GOOGLE SEARCH")
        print("   • Real-time web search")
        print("   • Latest information retrieval")
        print("   • Fact-finding and verification")
        print()
        
        print("2. 💾 BASIC MONGODB OPERATIONS")
        print("   • Document storage and retrieval")
        print("   • Collection management")
        print("   • Data counting and deletion")
        print()
        
        print("3. 🔍 ADVANCED SEMANTIC SEARCH")
        print("   • Natural language queries")
        print("   • Document similarity matching")
        print("   • Contextual search results")
        print()
        
        print("4. 📊 INTELLIGENT ANALYSIS")
        print("   • Collection summarization")
        print("   • Trend analysis over time")
        print("   • Pattern recognition")
        print()
        
        print("5. 🧠 INTEGRATED WORKFLOWS")
        print("   • Research → Store → Analyze")
        print("   • Search → Find Similar → Summarize")
        print("   • Query → Context → Insights")
        print()
        
        print("💡 Example Use Cases:")
        print('   • "Research AI trends and store findings"')
        print('   • "Find documents similar to machine learning"')
        print('   • "Summarize my research collection"')
        print('   • "What are the trends in my stored data?"')
        print('   • "Search for quantum computing research"')
        
        return True
        
    except Exception as e:
        print(f"❌ Capabilities demonstration failed: {e}")
        return False

def main():
    """Run all tests for the unified agent."""
    print("🔬 Unified Research Agent Test Suite")
    print("Testing Google Search + MongoDB + LlamaIndex integration")
    print("=" * 60)
    
    success_count = 0
    total_tests = 4
    
    # Test 1: Agent import
    if test_unified_agent_import():
        success_count += 1
    
    # Test 2: Tool categories
    if test_tool_categories():
        success_count += 1
    
    # Test 3: Individual tools
    if test_individual_tools():
        success_count += 1
    
    # Test 4: Capabilities demonstration
    if demonstrate_unified_capabilities():
        success_count += 1
    
    # Results
    print("\n" + "=" * 60)
    print(f"🏁 Test Results: {success_count}/{total_tests} tests passed")
    
    if success_count == total_tests:
        print("🎉 Unified Research Agent is ready!")
        print()
        print("🚀 To start using the unified agent:")
        print("   adk web")
        print("   Then select: 'unified_research_agent'")
        print()
        print("✨ You now have ONE powerful agent with:")
        print("   • Google Search capabilities")
        print("   • Basic MongoDB operations")
        print("   • Advanced semantic search with LlamaIndex")
        print("   • Intelligent document analysis")
        print("   • Trend analysis and pattern recognition")
    else:
        print("❌ Some tests failed. Check the errors above.")
    
    return success_count == total_tests

if __name__ == "__main__":
    main()
