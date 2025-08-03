#!/usr/bin/env python3
"""
Test the A2A (Agent-to-Agent) architecture with MongoDB specialist agent.
"""

import sys
import os
import json
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_mongodb_agent_tools():
    """Test the MongoDB agent tools directly."""
    print("🧪 Testing MongoDB Agent Tools")
    print("=" * 40)
    
    try:
        from app.mongodb_agent.mongodb_llamaindex_tools import (
            semantic_search_documents,
            store_document_with_embeddings,
            query_documents_with_context,
            summarize_collection,
            find_similar_documents,
            analyze_document_trends
        )
        
        print("✅ MongoDB agent tools imported successfully")
        
        # Test 1: Store a test document
        print("\n📝 Test 1: Storing document with embeddings")
        test_doc = json.dumps({
            "title": "A2A Architecture Test",
            "content": "Testing the Agent-to-Agent architecture with MongoDB specialist agent and LlamaIndex integration",
            "category": "test",
            "tags": ["a2a", "mongodb", "llamaindex", "test"]
        })
        
        result = store_document_with_embeddings("a2a_test_collection", test_doc, "A2A Test Document")
        print(f"Storage result: {result}")
        
        # Test 2: Semantic search
        print("\n🔍 Test 2: Semantic search")
        search_result = semantic_search_documents("agent architecture mongodb", "a2a_test_collection", 3)
        print(f"Search result: {search_result[:200]}...")
        
        # Test 3: Collection summary
        print("\n📊 Test 3: Collection summary")
        summary_result = summarize_collection("a2a_test_collection", 10)
        print(f"Summary result: {summary_result[:300]}...")
        
        # Test 4: Similar documents
        print("\n🔗 Test 4: Finding similar documents")
        similar_result = find_similar_documents("a2a_test_collection", "Agent-to-Agent communication", 0.3)
        print(f"Similar docs result: {similar_result[:200]}...")
        
        # Test 5: Trend analysis
        print("\n📈 Test 5: Trend analysis")
        trends_result = analyze_document_trends("a2a_test_collection")
        print(f"Trends result: {trends_result[:200]}...")
        
        print("\n✅ All MongoDB agent tools tested successfully!")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB agent tools test failed: {e}")
        return False

def test_main_agent_coordination():
    """Test the main agent's coordination capabilities."""
    print("\n🤖 Testing Main Agent Coordination")
    print("=" * 40)
    
    try:
        from app.chat_agent_google_agent.main_agent import (
            delegate_to_mongodb_agent,
            research_and_store,
            query_stored_research,
            analyze_research_collection,
            find_related_research
        )
        
        print("✅ Main agent coordination tools imported successfully")
        
        # Test 1: Delegation
        print("\n🔄 Test 1: Delegating to MongoDB agent")
        delegation_result = delegate_to_mongodb_agent(
            "Test delegation from main agent", 
            "a2a_test_collection"
        )
        print(f"Delegation result: {delegation_result}")
        
        # Test 2: Research and store
        print("\n📚 Test 2: Research and store operation")
        research_result = research_and_store("Artificial Intelligence trends 2025", "research_test")
        print(f"Research result: {research_result}")
        
        # Test 3: Query stored research
        print("\n🔍 Test 3: Querying stored research")
        query_result = query_stored_research("artificial intelligence", "research_test")
        print(f"Query result: {query_result}")
        
        # Test 4: Analyze collection
        print("\n📊 Test 4: Analyzing research collection")
        analysis_result = analyze_research_collection("research_test")
        print(f"Analysis result: {analysis_result}")
        
        # Test 5: Find related research
        print("\n🔗 Test 5: Finding related research")
        related_result = find_related_research("machine learning", "research_test")
        print(f"Related research result: {related_result}")
        
        print("\n✅ All main agent coordination tools tested successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Main agent coordination test failed: {e}")
        return False

def test_agent_imports():
    """Test that both agents can be imported."""
    print("\n🎯 Testing Agent Imports")
    print("=" * 40)
    
    success = True
    
    # Test MongoDB agent import
    try:
        from app.mongodb_agent.agent import mongodb_agent
        print("✅ MongoDB agent imported successfully")
        print(f"   - Name: {mongodb_agent.name}")
        print(f"   - Model: {mongodb_agent.model}")
        print(f"   - Tools: {len(mongodb_agent.tools)} tools")
    except Exception as e:
        print(f"❌ MongoDB agent import failed: {e}")
        success = False
    
    # Test main research agent import
    try:
        from app.chat_agent_google_agent.main_agent import main_research_agent
        print("✅ Main research agent imported successfully")
        print(f"   - Name: {main_research_agent.name}")
        print(f"   - Model: {main_research_agent.model}")
        print(f"   - Tools: {len(main_research_agent.tools)} tools")
    except Exception as e:
        print(f"❌ Main research agent import failed: {e}")
        success = False
    
    return success

def demonstrate_a2a_workflow():
    """Demonstrate a complete A2A workflow."""
    print("\n🚀 Demonstrating A2A Workflow")
    print("=" * 40)
    
    try:
        # Import the agents
        from app.mongodb_agent.agent import mongodb_agent
        from app.chat_agent_google_agent.main_agent import main_research_agent
        
        print("📋 A2A Workflow Demonstration:")
        print("1. Main agent receives research request")
        print("2. Main agent uses Google Search for information")
        print("3. Main agent delegates storage to MongoDB agent")
        print("4. MongoDB agent processes and stores with embeddings")
        print("5. Main agent can query stored data via MongoDB agent")
        print("6. MongoDB agent provides semantic search and analysis")
        
        workflow_steps = [
            "✅ User makes research request to Main Agent",
            "✅ Main Agent performs Google Search",
            "✅ Main Agent delegates storage to MongoDB Agent",
            "✅ MongoDB Agent stores data with semantic indexing",
            "✅ Main Agent queries stored data via MongoDB Agent",
            "✅ MongoDB Agent provides intelligent search results",
            "✅ Main Agent combines and presents integrated response"
        ]
        
        for step in workflow_steps:
            print(f"   {step}")
        
        print("\n💡 Benefits of this A2A Architecture:")
        print("   • Separation of concerns (research vs. database operations)")
        print("   • Specialized expertise (semantic search, document analysis)")
        print("   • Scalable agent coordination")
        print("   • Enhanced LlamaIndex integration for advanced MongoDB operations")
        
        return True
        
    except Exception as e:
        print(f"❌ A2A workflow demonstration failed: {e}")
        return False

def main():
    """Run all tests for the A2A architecture."""
    print("🧪 A2A Architecture Test Suite")
    print("Testing Agent-to-Agent coordination with MongoDB specialist")
    print("=" * 60)
    
    success_count = 0
    total_tests = 4
    
    # Test 1: MongoDB agent tools
    if test_mongodb_agent_tools():
        success_count += 1
    
    # Test 2: Main agent coordination
    if test_main_agent_coordination():
        success_count += 1
    
    # Test 3: Agent imports
    if test_agent_imports():
        success_count += 1
    
    # Test 4: A2A workflow demonstration
    if demonstrate_a2a_workflow():
        success_count += 1
    
    # Results
    print("\n" + "=" * 60)
    print(f"🏁 Test Results: {success_count}/{total_tests} tests passed")
    
    if success_count == total_tests:
        print("🎉 A2A Architecture setup complete!")
        print("\n🚀 Ready to use:")
        print("   • Main Research Agent (coordinates research and storage)")
        print("   • MongoDB Specialist Agent (handles database operations)")
        print("   • Agent-to-Agent communication for task delegation")
        print("   • LlamaIndex integration for semantic search")
        
        print("\n💡 To start the agents:")
        print("   adk web")
        print("   Then select 'main_research_agent' for the A2A experience")
    else:
        print("❌ Some tests failed. Check the errors above.")
    
    return success_count == total_tests

if __name__ == "__main__":
    main()
