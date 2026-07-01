#!/bin/bash

echo "Starting DriveMind databases..."

if docker ps --format '{{.Names}}' | grep -q "drivemind-telemetry-db"; then
  echo "MongoDB container is already running."
else
  if docker ps -a --format '{{.Names}}' | grep -q "drivemind-telemetry-db"; then
    echo "Starting existing MongoDB container..."
    docker start drivemind-telemetry-db
  else
    echo "Creating MongoDB container using Docker Compose..."
    docker compose up -d mongodb
  fi
fi

if docker ps --format '{{.Names}}' | grep -q "drivemind-neo4j"; then
  echo "Neo4j container is already running."
else
  if docker ps -a --format '{{.Names}}' | grep -q "drivemind-neo4j"; then
    echo "Starting existing Neo4j container..."
    docker start drivemind-neo4j
  else
    echo "Creating Neo4j container using Docker Compose..."
    docker compose up -d neo4j
  fi
fi

echo "MongoDB running on localhost:27017"
echo "Neo4j Browser running on http://localhost:7474"
echo "Neo4j Bolt running on bolt://localhost:7687"