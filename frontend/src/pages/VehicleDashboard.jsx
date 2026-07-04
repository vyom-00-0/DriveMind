import React, { useState, useEffect } from "react";
import VehicleCockpit from "./VehicleCockpit";
import V2VSharing from "./V2VSharing";

function VehicleDashboard({ onLogout, vehicle }) {
  // Tabs: 'cockpit' or 'v2v'
  const [activeSubTab, setActiveSubTab] = useState("cockpit");
  const [activeSegment, setActiveSegment] = useState("curve_42");

  useEffect(() => {
    // Read the active segment periodically or listen to localStorage updates
    const syncSegment = () => {
      setActiveSegment(localStorage.getItem("active_vehicle_segment") || "curve_42");
    };
    const interval = setInterval(syncSegment, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 relative">
      {/* Background glowing effects */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-950/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-slate-900/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900/80 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-indigo-400">DriveMind</h1>
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-950/40 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
                Vehicle Node
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Connected Telemetry stream Simulator & OTA Proximity Threat warnings
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/60 backdrop-blur-sm border border-slate-850 rounded-xl px-4 py-2">
            <div className="text-right">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Provisioned Vehicle ID</span>
              <span className="text-xs font-bold text-indigo-300 font-mono">{vehicle?.vehicleId || "legacy_vehicle"}</span>
            </div>
            <div className="w-px h-8 bg-slate-850"></div>
            <button
              onClick={onLogout}
              className="bg-red-500/15 hover:bg-red-500/25 border border-red-900/50 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </header>

        {/* Tab Selection */}
        <nav className="flex gap-2 border-b border-slate-900 pb-4 mb-6">
          <button
            onClick={() => setActiveSubTab("cockpit")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeSubTab === "cockpit"
                ? "bg-indigo-500/10 border-indigo-500/80 text-indigo-400"
                : "bg-slate-900/45 border-slate-900 text-slate-400 hover:border-slate-800"
            }`}
          >
            🏎️ Sensors Cockpit Simulator
          </button>
          <button
            onClick={() => setActiveSubTab("v2v")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeSubTab === "v2v"
                ? "bg-indigo-500/10 border-indigo-500/80 text-indigo-400"
                : "bg-slate-900/45 border-slate-900 text-slate-400 hover:border-slate-800"
            }`}
          >
            📡 V2V Proximity Alerts
          </button>
        </nav>

        {/* Dynamic Context banner */}
        <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3 px-4 mb-6 text-xs text-slate-400 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <p><strong>Device Status:</strong> <span className="text-emerald-400">Pinging Telemetry...</span></p>
            <p><strong>Sector:</strong> <span className="uppercase text-slate-350 font-semibold">{activeSegment.replace("_", " ")}</span></p>
          </div>
          <p className="text-[10px] text-slate-500">
            *Telemetry packets automatically append token headers issued on register.
          </p>
        </div>

        {/* Inner Tab Panels */}
        <main>
          {activeSubTab === "cockpit" ? (
            <div className="animate-fade-in">
              <VehicleCockpit />
            </div>
          ) : (
            <div className="animate-fade-in">
              <V2VSharing />
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default VehicleDashboard;
