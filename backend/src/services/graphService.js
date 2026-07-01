const { getNeo4jDriver } = require("../config/neo4j");

const createExperienceGraph = async ({
  vehicleId,
  roadSegmentId,
  weather,
  eventType,
  reason,
  riskScore,
  recommendedAction
}) => {
  const driver = getNeo4jDriver();

  if (!driver) {
    console.log("Neo4j driver not available. Graph memory skipped.");
    return null;
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MERGE (v:Vehicle {vehicleId: $vehicleId})
      MERGE (r:RoadSegment {roadSegmentId: $roadSegmentId})
      MERGE (w:Weather {type: $weather})
      MERGE (e:Event {type: $eventType})
      MERGE (a:Action {name: $recommendedAction})
      CREATE (exp:Experience {
        reason: $reason,
        riskScore: $riskScore,
        createdAt: datetime()
      })
      MERGE (v)-[:EXPERIENCED]->(exp)
      MERGE (exp)-[:AT]->(r)
      MERGE (exp)-[:DURING]->(w)
      MERGE (exp)-[:TYPE]->(e)
      MERGE (exp)-[:SUGGESTS]->(a)
      RETURN exp
      `,
      {
        vehicleId,
        roadSegmentId,
        weather,
        eventType,
        reason,
        riskScore,
        recommendedAction
      }
    );

    return result.records[0]?.get("exp") || null;
  } catch (error) {
    console.error("Failed to create Neo4j experience graph:", error.message);
    return null;
  } finally {
    await session.close();
  }
};

module.exports = {
  createExperienceGraph
};