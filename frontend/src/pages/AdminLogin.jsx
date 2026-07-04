import React, { useState } from "react";
import { loginUser, registerUser } from "../api/backendApi";

function AdminLogin({ onAuthSuccess, onBackToSelector }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const data = await registerUser(username, password);
        if (data.success) {
          localStorage.setItem("drivemind_admin_token", data.token);
          localStorage.setItem("drivemind_admin_user", JSON.stringify(data.user));
          onAuthSuccess(data.token, data.user);
        } else {
          setError(data.message || "Registration failed");
        }
      } else {
        const data = await loginUser(username, password);
        if (data.success) {
          localStorage.setItem("drivemind_admin_token", data.token);
          localStorage.setItem("drivemind_admin_user", JSON.stringify(data.user));
          onAuthSuccess(data.token, data.user);
        } else {
          setError(data.message || "Invalid credentials");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none"></div>

      <div className="max-w-md w-full z-10">
        
        {/* Back Button */}
        <button 
          onClick={onBackToSelector}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-cyan-400 mb-6 cursor-pointer transition-colors"
        >
          <span>←</span>
          <span>Back to Portal Selection</span>
        </button>

        {/* Auth form card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-900/30 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
              Tata Group Secure Ingress
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mt-3">
              {isRegister ? "Register Admin Account" : "Admin Login Portal"}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isRegister 
                ? "Sign up to join the Tata Group DriveMind regional traffic analytics team." 
                : "Authenticate to access regional hazard maps and knowledge networks."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. tata_analyst_01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 rounded-lg p-2.5">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Access Analytics Panel"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-850 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setUsername("");
                setPassword("");
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
            >
              {isRegister
                ? "Already have an account? Log In"
                : "Need an account? Register here"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
