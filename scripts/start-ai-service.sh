#!/bin/bash

echo "Starting DriveMind AI service..."

cd ai-service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000