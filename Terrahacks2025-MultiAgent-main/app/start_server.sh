#!/bin/bash

# Kill any processes using port 8000
echo "Checking for processes using port 8000..."
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "Found processes using port 8000. Killing them..."
    lsof -ti:8000 | xargs kill -9
    echo "Processes killed."
    sleep 2
else
    echo "No processes found using port 8000."
fi

# Start ADK web server
echo "Starting ADK web server..."
adk web
