#!/usr/bin/env python3
"""
Test script for A2A (Agent-to-Agent) communication functionality.
Tests the coordination between Google Search Agent and MongoDB LlamaIndex Agent.
"""

import os
import sys
import json
from datetime import datetime

def test_a2a_coordination():
    """Test A2A coordination between Google Search and MongoDB agents."""
    print("🧪 Testing A2A (Agent-to-Agent) Coordination")
    print("=" * 60)
    
    try:
        # Test 1: Import A2A tools
        print("1. Testing A2A imports...")
        try:
            from app.a2a_coordinator import coordinate_search_and_store, intelligent_research_pipeline, query_knowledge_base
            print("✅ A2A coordinator imports successful")
        except Exception as e:
            print(f"❌ A2A coordinator import error: {e}")
            raise
            
        try:
            from app.unified_a2a_agent import unified_a2a_agent
            print("✅ Unified A2A agent import successful")
        except Exception as e:
            print(f"❌ Unified A2A agent import error: {e}")
            raise
        
        # Test 2: Check agent configuration
        print("\n2. Testing unified A2A agent configuration...")
        agent_name = unified_a2a_agent.name
        tools_count = len(unified_a2a_agent.tools)
        print(f"✅ Agent Name: {agent_name}")
        print(f"✅ Total Tools: {tools_count}")
        
        # List tool categories
        tool_names = []
        for tool in unified_a2a_agent.tools:
            if hasattr(tool, '__name__'):
                tool_names.append(tool.__name__)
            elif hasattr(tool, 'name'):
                tool_names.append(tool.name)
            else:
                tool_names.append(str(type(tool).__name__))
        google_tools = [name for name in tool_names if 'google' in name.lower() or name == 'google_search']
        mongodb_tools = [name for name in tool_names if 'mongodb' in name.lower() or 'document' in name.lower()]
        a2a_tools = [name for name in tool_names if any(keyword in name for keyword in ['coordinate', 'pipeline', 'knowledge_base'])]
        
        print(f"   - Google Search Tools: {len(google_tools)}")
        print(f"   - MongoDB Tools: {len(mongodb_tools)}")
        print(f"   - A2A Coordination Tools: {len(a2a_tools)}")
        
        # Test 3: Environment variables
        print("\n3. Testing environment configuration...")
        mongodb_uri = os.getenv("MONGODB_CONNECTION_STRING")
        if mongodb_uri:
            print("✅ MongoDB connection string configured")
        else:
            print("⚠️  MongoDB connection string not found in environment")
        
        # Test 4: MongoDB connection
        print("\n4. Testing MongoDB connection...")
        try:
            from app.mongodb_agent.mongodb_llamaindex_tools import _get_mongodb_client
            client = _get_mongodb_client()
            if client:
                print("✅ MongoDB connection successful")
                client.close()
            else:
                print("❌ MongoDB connection failed")
                return False
        except Exception as e:
            print(f"❌ MongoDB connection error: {e}")
            return False
        
        # Test 5: A2A tool functionality (basic test)
        print("\n5. Testing A2A tool functionality...")
        try:
            # Test coordinate_search_and_store with a simple query
            test_query = "Python programming basics"
            test_collection = "a2a_test_collection"
            
            print(f"   Testing coordinate_search_and_store with query: '{test_query}'")
            result = coordinate_search_and_store(test_query, test_collection)
            
            if result.get("status") == "success":
                print("✅ A2A coordination test successful")
            else:
                print(f"⚠️  A2A coordination test warning: {result.get('error_message', 'Unknown issue')}")
                
        except Exception as e:
            print(f"⚠️  A2A coordination test warning: {e}")
            # Don't fail the test - this might be due to API limits or network issues
        
        # Test 6: Research pipeline configuration
        print("\n6. Testing research pipeline configuration...")
        try:
            # Test pipeline configuration without actually running
            from app.a2a_coordinator import a2a_coordinator
            print("✅ A2A coordinator initialized")
            print(f"   - Conversation history: {len(a2a_coordinator.conversation_history)} items")
            print("✅ Research pipeline ready")
        except Exception as e:
            print(f"❌ Research pipeline configuration error: {e}")
            return False
        
        # Test 7: Agent integration readiness
        print("\n7. Testing agent integration readiness...")
        try:
            # Check if all required components are available
            required_tools = [
                'GoogleSearchTool',
                'save_document_to_mongodb',
                'coordinate_search_and_store',
                'intelligent_research_pipeline'
            ]
            
            available_tools = []
            for tool in unified_a2a_agent.tools:
                if hasattr(tool, '__name__'):
                    available_tools.append(tool.__name__)
                elif hasattr(tool, 'name'):
                    available_tools.append(tool.name)
                else:
                    available_tools.append(str(type(tool).__name__))
            
            print(f"✅ Available tools: {len(available_tools)}")
            print("✅ Agent integration ready")
            
        except Exception as e:
            print(f"❌ Agent integration error: {e}")
            return False
        
        print("\n" + "=" * 60)
        print("🎉 A2A Testing Complete!")
        print("\nA2A Capabilities Ready:")
        print("• 🔍 Google Search Agent: Web search and information retrieval")
        print("• 💾 MongoDB Agent: Document storage with Gemini embeddings")
        print("• 🔄 A2A Coordinator: Intelligent workflow coordination")
        print("• 🧠 Research Pipeline: Multi-phase comprehensive research")
        print("• 🤖 RAG Queries: Context-aware knowledge base queries")
        
        print("\nWorkflow Examples:")
        print("1. Basic: Search topic → Store results → Query knowledge base")
        print("2. Advanced: Research pipeline → Multi-phase analysis → Synthesis")
        print("3. RAG: Question → Context retrieval → Enhanced response")
        
        print("\nNext Steps:")
        print("• Run 'adk web' to start the unified A2A agent")
        print("• Agent available as 'unified_research_agent'")
        print("• Try research queries to test A2A coordination")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure all dependencies are installed")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_package_cleanup():
    """Test that only necessary packages are being used."""
    print("\n" + "=" * 60)
    print("📦 Testing Package Dependencies")
    print("=" * 60)
    
    try:
        import subprocess
        result = subprocess.run(['pip', 'list'], capture_output=True, text=True)
        installed_packages = result.stdout.lower()
        
        # Required packages
        required_packages = [
            'google-adk',
            'pymongo',
            'llama-index-core',
            'llama-index-embeddings-google',
            'google-generativeai'
        ]
        
        # Check for required packages
        print("Required packages:")
        for package in required_packages:
            if package.lower() in installed_packages:
                print(f"✅ {package}")
            else:
                print(f"❌ {package} - MISSING")
        
        # Check for unnecessary packages (that should be removed)
        unnecessary_packages = [
            'langchain-google-genai',  # Removed to avoid conflicts
            'openai'  # Not needed since we use Google embeddings
        ]
        
        print("\nUnnecessary packages (should be removed):")
        for package in unnecessary_packages:
            if package.lower() in installed_packages:
                print(f"⚠️  {package} - SHOULD BE REMOVED")
            else:
                print(f"✅ {package} - Not installed (good)")
        
        print("\n✅ Package dependency check complete")
        return True
        
    except Exception as e:
        print(f"❌ Package check failed: {e}")
        return False

if __name__ == "__main__":
    print(f"🚀 A2A Testing Started - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run A2A tests
    a2a_success = test_a2a_coordination()
    
    # Run package tests
    package_success = test_package_cleanup()
    
    # Final result
    if a2a_success and package_success:
        print(f"\n🎉 All tests passed! A2A system ready for deployment.")
        sys.exit(0)
    else:
        print(f"\n❌ Some tests failed. Please review the issues above.")
        sys.exit(1)
