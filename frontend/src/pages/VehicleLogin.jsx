import React, { useState } from "react";
import { registerVehicle } from "../api/backendApi";

function VehicleLogin({ onAuthSuccess, onBackToSelector }) {
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerVehicle(vehicleId, vehicleType);
      if (data.success) {
        localStorage.setItem("active_vehicle_token", data.token);
        localStorage.setItem("active_vehicle_id", vehicleId);
        onAuthSuccess(data.token, { vehicleId, vehicleType });
      } else {
        setError(data.message || "Vehicle registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register vehicle identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute bottom-[-25%] right-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-900/15 blur-[130px] pointer-events-none"></div>

      <div className="max-w-md w-full z-10">
        
        {/* Back Button */}
        <button 
          onClick={onBackToSelector}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-400 mb-6 cursor-pointer transition-colors"
        >
          <span>←</span>
          <span>Back to Portal Selection</span>
        </button>

        {/* Auth form card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-900/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
              Connected Vehicle Terminal
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mt-3">
              Vehicle Ingress Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Register your vehicle ID to receive a dynamic verification token. This authorizes your telemetry sensors and V2V proximity channels.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Vehicle ID / License Plate
              </label>
              <input
                type="text"
                required
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                placeholder="e.g. MH-12-TATA-8900"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-750 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Vehicle Class
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 text-slate-300"
              >
                <option value="car">Car (Passenger vehicle)</option>
                <option value="truck">Truck (Commercial cargo)</option>
                <option value="bus">Bus (Transit transport)</option>
                <option value="bike">Bike (Two-wheeler)</option>
                <option value="emergency">Emergency Response (Ambulance/Police)</option>
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
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Provision Active Vehicle"
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

export default VehicleLogin;
