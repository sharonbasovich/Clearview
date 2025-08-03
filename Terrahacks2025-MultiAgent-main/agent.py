"""
A2A System Agent Configuration for ADK Web
This file configures the A2A coordinator agent for deployment with 'adk web'
"""

from app.a2a_coordinator_agent import a2a_coordinator_agent

# Export the agent for ADK web command
agent = a2a_coordinator_agent

# Agent metadata for ADK
__agent__ = a2a_coordinator_agent
__all__ = ['agent', 'a2a_coordinator_agent']
