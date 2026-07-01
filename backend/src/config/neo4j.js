const neo4j = require("neo4j-driver");

let driver = null;

const connectNeo4j = () => {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !username || !password) {
    console.log("Neo4j config not found. Neo4j connection skipped.");
    return null;
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

  console.log("Neo4j driver initialized");

  return driver;
};

const getNeo4jDriver = () => {
  return driver;
};

module.exports = {
  connectNeo4j,
  getNeo4jDriver
};