import React from "react";

function PortalSelect({ onSelectPortal }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-950/25 blur-[130px] pointer-events-none"></div>

      <div className="max-w-4xl w-full text-center mb-12 z-10">
        <div className="inline-flex items-center space-x-2 bg-cyan-950/60 border border-cyan-800/40 rounded-full px-3 py-1 text-cyan-400 text-xs font-semibold shadow-sm mb-4">
          <span>🛡️</span>
          <span>DriveMind V2X Safety Networks</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-450 via-indigo-200 to-white bg-clip-text text-transparent">
          DriveMind Portal Hub
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
          Experience-sharing connected vehicle system. Select your login portal below to monitor analytics or stream sensor telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full z-10">
        
        {/* Admin Card */}
        <div 
          onClick={() => onSelectPortal("admin")}
          className="group bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-sm border border-slate-850 hover:border-cyan-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mt-6 mb-2 group-hover:text-cyan-400 transition-colors">
              Tata Group Admin Portal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Designed for regional system operations. Monitor backend service metrics, analyze geographic hazard maps (Leaflet risk rings), inspect MongoDB database experience logs, and inspect Neo4j graph nodes.
            </p>
          </div>
          <button className="w-full bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-bold py-3 rounded-xl transition-all group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-transparent cursor-pointer">
            Enter Admin Analytics
          </button>
        </div>

        {/* Vehicle Card */}
        <div 
          onClick={() => onSelectPortal("vehicle")}
          className="group bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-sm border border-slate-850 hover:border-indigo-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏎️
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mt-6 mb-2 group-hover:text-indigo-400 transition-colors">
              Connected Vehicle Cockpit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Designed for individual vehicle client nodes. Provision cryptographic tokens, control physical sensors (speed, steering, brake pressure sliders) inside the HUD cockpit, and view live proximity alert warnings.
            </p>
          </div>
          <button className="w-full bg-slate-950 border border-slate-800 text-indigo-400 text-xs font-bold py-3 rounded-xl transition-all group-hover:bg-indigo-500 group-hover:text-slate-950 group-hover:border-transparent cursor-pointer">
            Enter Vehicle Cockpit
          </button>
        </div>

      </div>
    </div>
  );
}

export default PortalSelect;
