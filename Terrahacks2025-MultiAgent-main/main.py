"""
A2A (Agent-to-Agent) Communication System
Main entry point for the three-agent architecture:
1. google-chat: User interaction + Google search + MongoDB coordination
2. llamaindex-mongoDB-agent: MongoDB RAG operations
3. google-summarization: Text summarization and organization
"""

from google.adk import Runner
from app.a2a_coordinator_agent import a2a_coordinator_agent

def main():
    """Main entry point for the A2A system."""
    print("🚀 Starting A2A Communication System")
    print("🤖 Agent: unified_a2a_coordinator")
    print("🔄 Three-agent architecture:")
    print("   1. Google-Chat: User interaction + Google search + MongoDB coordination")
    print("   2. LlamaIndex-MongoDB: MongoDB RAG operations")
    print("   3. Google-Summarization: Text summarization and organization")
    print("💡 Features: User interaction, research workflows, document analysis, A2A coordination")
    
    # Create and run the agent
    runner = Runner(
        agent=a2a_coordinator_agent,
        app_name="A2A Communication System", 
        session_service="local"
    )
    runner.run()

if __name__ == "__main__":
    main()
