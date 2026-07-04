import React, { useEffect, useState } from "react";
import {
  getAllExperiences,
  getGraphOverview,
  getHealthStatus,
  getRoadRisk,
  getRiskClusters
} from "../api/backendApi";
import { socket } from "../socket/socketClient";
import RiskMap from "../components/RiskMap";

function AdminDashboard({ onLogout, user }) {
  const [health, setHealth] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [roadRisk, setRoadRisk] = useState(null);
  const [graphRelationships, setGraphRelationships] = useState([]);
  const [riskClusters, setRiskClusters] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState("curve_42");

  const loadDashboardData = async () => {
    try {
      const healthData = await getHealthStatus();
      const experienceData = await getAllExperiences();
      const riskData = await getRoadRisk(selectedSegment);
      const graphData = await getGraphOverview();
      
      let clusterData = { data: [] };
      try {
        clusterData = await getRiskClusters();
      } catch (err) {
        console.warn("Failed to load Neo4j risk clusters:", err);
      }

      setHealth(healthData);
      setExperiences(experienceData.data || []);
      setRoadRisk(riskData);
      setGraphRelationships(graphData.data || []);
      setRiskClusters(clusterData.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleSocketAlert = (alert) => {
      setLatestAlert(alert);
      loadDashboardData();
    };

    socket.on("risk-alert", handleSocketAlert);

    return () => {
      socket.off("risk-alert", handleSocketAlert);
    };
  }, [selectedSegment]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 relative">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-950/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-950/20 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-cyan-400">DriveMind</h1>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-900/40 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
                Tata Analytics
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Regional Operations Dashboard & Central Road Safety Analytics Ledger
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/60 backdrop-blur-sm border border-slate-850 rounded-xl px-4 py-2">
            <div className="text-right">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Tata Operations Team</span>
              <span className="text-xs font-bold text-cyan-200">{user?.username || "admin_operator"}</span>
            </div>
            <div className="w-px h-8 bg-slate-850"></div>
            <button
              onClick={onLogout}
              className="bg-red-500/15 hover:bg-red-500/25 border border-red-900/50 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Analytics Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Backend Status</span>
            <span className="text-md font-bold text-slate-200 mt-1 block">
              {health ? health.message : "Pinging API..."}
            </span>
            {health && (
              <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-900/30 rounded">
                Server Online
              </span>
            )}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Inspected Segment</span>
            <span className="text-md font-bold text-slate-250 mt-1 block capitalize">
              {selectedSegment.replace("_", " ")}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              Index:{" "}
              <span className={`font-bold ${
                roadRisk?.riskLevel === "critical" || roadRisk?.riskLevel === "high" 
                  ? "text-red-400" 
                  : "text-emerald-400"
              }`}>
                {roadRisk?.riskLevel || "Low"}
              </span>{" "}
              ({roadRisk?.riskScore ?? 0})
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Experience Log Count</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{experiences.length}</span>
            </div>
            <span className="text-[8px] text-slate-600 font-mono">Records stored in MongoDB</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Graph Relationships</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{graphRelationships.length}</span>
            </div>
            <span className="text-[8px] text-slate-600 font-mono">Linked nodes in Neo4j</span>
          </div>
        </div>

        {/* Dynamic Hazards Heatmap */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Proactive Road Hazards Map</h3>
              <p className="text-xs text-slate-500">Live monitoring of road segments and risk alert rings</p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-xs text-slate-400 font-medium">Select Focus Grid:</label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 text-slate-350"
              >
                <option value="curve_42">Gateway Curve (Curve-42)</option>
                <option value="highway_101">Marine Drive (Highway-101)</option>
                <option value="intersection_alpha">Crawford (Intersection-Alpha)</option>
              </select>
            </div>
          </div>
          <RiskMap activeRoadRisk={roadRisk} latestAlert={latestAlert} />
        </div>

        {/* Neo4j insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Neo4j Risk Clusters */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-slate-200 mb-1">Neo4j Hazard Clusters</h3>
            <p className="text-xs text-slate-500 mb-4">Adjacent segments linked by identical hazards (Cypher similarity)</p>
            
            <div className="space-y-2.5 max-h-[250px] overflow-auto">
              {riskClusters.length > 0 ? (
                riskClusters.map((cluster, index) => (
                  <div
                    key={index}
                    className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-slate-350">{cluster.segmentA} ↔ {cluster.segmentB}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                        Shared hazard: {cluster.sharedRiskType?.replace("_", " ")}
                      </p>
                    </div>
                    <span className="bg-cyan-500/10 border border-cyan-900/30 text-cyan-300 px-2 py-0.5 rounded text-[9px] font-bold">
                      Strength: {cluster.strength}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-850 rounded-xl text-slate-650 text-xs">
                  No shared threat clusters calculated yet.
                </div>
              )}
            </div>
          </div>

          {/* Graph relationships list */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-slate-200 mb-1">Graph Relationship Triples</h3>
            <p className="text-xs text-slate-500 mb-4">Semantic links queried from Neo4j DB</p>
            
            <div className="space-y-2.5 max-h-[250px] overflow-auto">
              {graphRelationships.length > 0 ? (
                graphRelationships.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs font-mono text-cyan-300"
                  >
                    <span className="text-slate-300 font-semibold font-sans">{item.start.labels.join(", ")}</span>
                    {" -> "}{item.relationship.type}{" -> "}
                    <span className="text-slate-300 font-semibold font-sans">{item.end.labels.join(", ")}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-850 rounded-xl text-slate-650 text-xs">
                  No relationship maps active.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MongoDB Experience Ledger */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-slate-200 mb-1">MongoDB Experience Memory Ledger</h3>
          <p className="text-xs text-slate-500 mb-4">Historical record list registered in MongoDB telemetry nodes</p>
          
          <div className="space-y-3 max-h-[350px] overflow-auto">
            {experiences.length > 0 ? (
              experiences.map((experience) => (
                <div
                  key={experience._id}
                  className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col sm:flex-row justify-between text-xs gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{experience.vehicleId}</span>
                      <span className="bg-slate-800 text-slate-400 font-semibold uppercase text-[9px] px-1.5 py-0.5 rounded">
                        {experience.eventType?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-2">
                      Sector: <span className="text-slate-250 uppercase font-mono">{experience.roadSegmentId}</span> | 
                      Weather: <span className="text-slate-250 capitalize">{experience.weather}</span>
                    </p>
                    <p className="text-[10px] text-slate-550 italic mt-1">Reason: {experience.reason}</p>
                  </div>
                  <div className="text-left sm:text-right flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500">Risk Score:</span>{" "}
                      <span className="font-bold text-cyan-300">{experience.riskScore}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">Proactive Safety Action</span>
                      <span className="text-amber-400 font-bold capitalize">
                        {experience.recommendedAction?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-850 rounded-xl text-slate-650 text-xs">
                No experience records stored.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
