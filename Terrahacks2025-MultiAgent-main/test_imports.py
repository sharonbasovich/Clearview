#!/usr/bin/env python3
"""
Simple test to verify the ADK agent loads correctly.
"""

def test_agent_import():
    """Test that the agent can be imported successfully."""
    try:
        from app.chat_agent_google_agent.agent import unified_agent
        print("✅ Agent imported successfully!")
        print(f"   - Name: {unified_agent.name}")
        print(f"   - Model: {unified_agent.model}")
        print(f"   - Number of tools: {len(unified_agent.tools)}")
        
        # List tool names
        tool_names = []
        for tool in unified_agent.tools:
            if hasattr(tool, '__name__'):
                tool_names.append(tool.__name__)
            else:
                tool_names.append(str(tool))
        
        print(f"   - Tools: {', '.join(tool_names)}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to import agent: {e}")
        return False

def test_mongodb_tools():
    """Test that MongoDB tools can be imported."""
    try:
        from app.chat_agent_google_agent.mongo_tools import MONGODB_TOOLS
        print(f"✅ MongoDB tools imported successfully! ({len(MONGODB_TOOLS)} tools)")
        
        for tool in MONGODB_TOOLS:
            print(f"   - {tool.__name__}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to import MongoDB tools: {e}")
        return False

def main():
    print("🧪 ADK Agent Import Test")
    print("=" * 30)
    
    success = True
    
    # Test MongoDB tools import
    if not test_mongodb_tools():
        success = False
    
    print()
    
    # Test agent import
    if not test_agent_import():
        success = False
    
    print("\n" + "=" * 30)
    if success:
        print("🎉 All imports successful! The agent is ready to run.")
        print("\n🚀 To start the agent, run:")
        print("   adk web")
    else:
        print("❌ Some imports failed. Check the errors above.")
    
    return success

if __name__ == "__main__":
    main()
