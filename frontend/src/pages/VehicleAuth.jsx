import { useState, useEffect } from "react";
import { registerVehicle } from "../api/backendApi";

function VehicleAuth({ onVehicleActivated }) {
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenResult, setTokenResult] = useState("");
  
  const [activeVehicleId, setActiveVehicleId] = useState("");

  useEffect(() => {
    setActiveVehicleId(localStorage.getItem("active_vehicle_id") || "None (Legacy Simulation Mode)");
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setTokenResult("");
    setLoading(true);

    try {
      const data = await registerVehicle(vehicleId, vehicleType);
      if (data.success) {
        setTokenResult(data.token);
      } else {
        setError(data.message || "Failed to register vehicle identity");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = () => {
    if (!tokenResult) return;
    localStorage.setItem("active_vehicle_token", tokenResult);
    localStorage.setItem("active_vehicle_id", vehicleId);
    setActiveVehicleId(vehicleId);
    if (onVehicleActivated) {
      onVehicleActivated(vehicleId);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-slate-100 mb-1">Vehicle Provisioning & Authentication</h3>
        <p className="text-xs text-slate-500 mb-6">
          Register new vehicles to authorize their sensor data payloads and verify security signatures.
        </p>

        {/* Current Active Vehicle Context */}
        <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Provisioned Vehicle</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">{activeVehicleId}</span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-800/30">
            Authorized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Vehicle ID / Plate
              </label>
              <input
                type="text"
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                placeholder="e.g. mh_12_tata_89"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Vehicle Class
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="car">Car (Passenger vehicle)</option>
                <option value="truck">Truck (Commercial cargo)</option>
                <option value="bus">Bus (Transit transport)</option>
                <option value="bike">Bike (Two-wheeler vehicle)</option>
                <option value="emergency">Emergency (Ambulance/Police)</option>
              </select>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 rounded-lg p-2.5">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-400 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Generate Auth Token"
              )}
            </button>
          </form>

          {/* Authorization Result */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cryptographic Token Output</h4>
              
              {tokenResult ? (
                <div>
                  <textarea
                    readOnly
                    value={tokenResult}
                    className="w-full h-[90px] bg-slate-950 text-[10px] text-slate-400 font-mono rounded-lg p-2 border border-slate-800 focus:outline-none resize-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">✓ Keys registered successfully. Click below to load it into sensors context.</p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-600">
                  <span className="text-3xl block mb-1">🔑</span>
                  <p className="text-xs">Token generated here upon successful registration.</p>
                </div>
              )}
            </div>

            {tokenResult && (
              <button
                onClick={handleActivate}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-bold py-2 rounded-lg text-xs mt-4 transition-colors cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                Activate Vehicle Profile
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default VehicleAuth;
