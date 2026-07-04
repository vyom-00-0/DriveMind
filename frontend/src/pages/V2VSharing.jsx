import { useState, useEffect } from "react";
import { socket } from "../socket/socketClient";

// Define segment adjacencies for V2X proximity checks
const ADJACENCY_MAP = {
  curve_42: ["highway_101"],
  highway_101: ["curve_42", "intersection_alpha"],
  intersection_alpha: ["highway_101"]
};

function V2VSharing() {
  const [activeVehicleId, setActiveVehicleId] = useState("");
  const [activeSegment, setActiveSegment] = useState("curve_42");
  const [localAlerts, setLocalAlerts] = useState([]);

  const loadVehicleContext = () => {
    setActiveVehicleId(localStorage.getItem("active_vehicle_id") || "None (Legacy Simulation)");
    // The active segment can be inferred or set; for V2V demonstration, we pull it from local cockpit storage or defaults
    setActiveSegment(localStorage.getItem("active_vehicle_segment") || "curve_42");
  };

  useEffect(() => {
    loadVehicleContext();

    // Listen to live alerts
    const handleAlert = (alert) => {
      // Add timestamp
      const timestampedAlert = {
        ...alert,
        receivedAt: new Date().toLocaleTimeString()
      };

      setLocalAlerts((prev) => [timestampedAlert, ...prev].slice(0, 10)); // keep last 10
    };

    socket.on("risk-alert", handleAlert);

    // Poll storage occasionally to sync segment changes from cockpit
    const syncInterval = setInterval(loadVehicleContext, 1500);

    return () => {
      socket.off("risk-alert", handleAlert);
      clearInterval(syncInterval);
    };
  }, []);

  const getProximityStatus = (alertSegment) => {
    if (alertSegment === activeSegment) {
      return {
        label: "⚠️ CRITICAL: Threat on Current Segment!",
        bg: "bg-red-500/10 border-red-500 text-red-300",
        indicator: "bg-red-500"
      };
    }

    const adjacents = ADJACENCY_MAP[activeSegment] || [];
    if (adjacents.includes(alertSegment)) {
      return {
        label: "⚡ WARNING: Threat on Adjacent Segment Ahead!",
        bg: "bg-amber-500/10 border-amber-600 text-amber-300",
        indicator: "bg-amber-500"
      };
    }

    return {
      label: "📡 INFO: Distant Segment Hazard Logged",
      bg: "bg-slate-900/60 border-slate-800 text-slate-400",
      indicator: "bg-slate-700"
    };
  };

  const handleClearAlerts = () => {
    setLocalAlerts([]);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100">V2V Proximity Alert Feeds</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates shared over-the-air with nearby vehicles to pre-emptively mitigate road hazards.
            </p>
          </div>
          <button
            onClick={handleClearAlerts}
            className="text-xs text-slate-500 hover:text-slate-400 border border-slate-800 hover:border-slate-750 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Clear Log
          </button>
        </div>

        {/* Current Vehicle Position Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Assigned Vehicle</span>
              <span className="text-xs font-bold text-cyan-300 font-mono">{activeVehicleId}</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">OTA Enabled</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold block">Telemetry Location Node</span>
              <span className="text-xs font-bold text-indigo-300 uppercase font-mono">{activeSegment.replace("_", " ")}</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/30">
              Active Grid
            </span>
          </div>
        </div>

        {/* V2V alerts display */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Broadcast Warnings</h4>
          
          {localAlerts.length > 0 ? (
            <div className="space-y-3">
              {localAlerts.map((alert, index) => {
                const proximity = getProximityStatus(alert.roadSegmentId);
                return (
                  <div
                    key={index}
                    className={`border rounded-xl p-4 shadow-sm relative overflow-hidden transition-all ${proximity.bg}`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full swap-bg" style={{ backgroundColor: proximity.indicator }}></div>
                    <div className="flex justify-between items-center text-[10px] mb-2 font-bold tracking-wide">
                      <span>{proximity.label}</span>
                      <span className="text-slate-500 font-mono">{alert.receivedAt}</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-200 mt-1">{alert.message}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-850/60 text-xs text-slate-400">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase">Alert Source</p>
                        <p className="font-bold text-slate-300 font-mono">{alert.vehicleId}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase">Sector</p>
                        <p className="font-bold text-slate-300 uppercase font-mono">{alert.roadSegmentId}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase">AI Intent Prediction</p>
                        <p className="font-bold text-cyan-300 capitalize">{alert.predictedIntent}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase">Target Action</p>
                        <p className="font-bold text-amber-400 capitalize">{alert.recommendedAction?.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <span className="text-4xl block mb-2 opacity-30">📡</span>
              <p className="text-xs text-slate-500 font-medium">Waiting for wireless experience relay alerts...</p>
              <p className="text-[10px] text-slate-600 mt-1">
                Tip: Go to "Cockpit Simulator", enable Auto-Stream, and cause a risk event (e.g. Swerve or Speed) to broadcast warnings.
              </p>
            </div>
          )}
        </div>

        {/* Explainers for beginners */}
        <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">🎓 Beginner's Guide: Understanding DriveMind's V2X Sharing</h4>
          
          <div className="relative border-l-2 border-slate-800 pl-4 ml-2 space-y-5 text-xs text-slate-400">
            <div>
              <span className="absolute -left-[9px] top-0 w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">1</span>
              <h5 className="font-bold text-slate-200">Edge Sensing</h5>
              <p className="mt-0.5">Sensors monitor speed, steering, and lane deviation values directly inside the vehicle client.</p>
            </div>

            <div>
              <span className="absolute -left-[9px] top-[74px] w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">2</span>
              <h5 className="font-bold text-slate-200">Incident Classification</h5>
              <p className="mt-0.5">If the edge metrics cross safe bounds (e.g. sharp steering at high speeds), the engine identifies a risk and classifies the intent.</p>
            </div>

            <div>
              <span className="absolute -left-[9px] top-[148px] w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">3</span>
              <h5 className="font-bold text-slate-200">Graph Registry Upload</h5>
              <p className="mt-0.5">The threat is converted into a small byte experience package (reason, risk level, action) and logged inside the collective graph.</p>
            </div>

            <div>
              <span className="absolute -left-[9px] top-[222px] w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">4</span>
              <h5 className="font-bold text-slate-200">OTA Broadcast Warning</h5>
              <p className="mt-0.5">Socket servers broadcast the threat to all neighboring cars. Sockets check proximity ranges and flash warnings if approaching the segment.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default V2VSharing;
