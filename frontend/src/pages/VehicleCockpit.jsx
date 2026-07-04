import { useState, useEffect, useRef } from "react";
import { sendTelemetry } from "../api/backendApi";

function VehicleCockpit() {
  // Sensor states
  const [speed, setSpeed] = useState(50);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [brakePressure, setBrakePressure] = useState(0);
  const [laneOffset, setLaneOffset] = useState(0);
  const [distance, setDistance] = useState(40);
  const [acceleration, setAcceleration] = useState(0.2);
  const [weather, setWeather] = useState("clear");
  const [segment, setSegment] = useState("curve_42");

  // Streaming & API states
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamCount, setStreamCount] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const streamIntervalRef = useRef(null);

  // Active vehicle provisioning check
  const activeVehicleId = localStorage.getItem("active_vehicle_id") || "legacy_vehicle_sim";

  const handleTransmit = async () => {
    setErrorMessage("");
    const payload = {
      vehicleId: activeVehicleId,
      roadSegmentId: segment,
      speed: Number(speed),
      acceleration: Number(acceleration),
      brakePressure: Number(brakePressure),
      steeringAngle: Number(steeringAngle),
      laneOffset: Number(laneOffset),
      distanceToFrontVehicle: Number(distance),
      weather
    };

    try {
      const response = await sendTelemetry(payload);
      setApiResponse(response.data);
      if (isStreaming) {
        setStreamCount((prev) => prev + 1);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to transmit telemetry package");
      if (isStreaming) {
        setIsStreaming(false); // halt streaming on auth failure or connection drop
      }
    }
  };

  // Manage automated streaming interval
  useEffect(() => {
    if (isStreaming) {
      handleTransmit(); // send initial immediately
      streamIntervalRef.current = setInterval(() => {
        handleTransmit();
      }, 1000);
    } else {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    }

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [isStreaming, speed, steeringAngle, brakePressure, laneOffset, distance, acceleration, weather, segment]);

  const handleEmergencyBrake = () => {
    setBrakePressure(0.95);
    setAcceleration(-3.5);
    setSpeed((prev) => Math.max(0, prev - 25));
  };

  const handleQuickTurn = (dir) => {
    setSteeringAngle(dir === "left" ? -28 : 28);
    setLaneOffset(dir === "left" ? -0.7 : 0.7);
  };

  const handleResetSensors = () => {
    setSpeed(50);
    setSteeringAngle(0);
    setBrakePressure(0);
    setLaneOffset(0);
    setDistance(40);
    setAcceleration(0.2);
    setWeather("clear");
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cockpit HUD and Live Metrics (Lefthand Column) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xl font-bold text-slate-100">Vehicle Cockpit</h3>
              <span className="text-[10px] text-slate-500 font-bold font-mono">ID: {activeVehicleId}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time driver HUD. Adjust the sliders to simulate live physical sensor values.
            </p>
          </div>

          {/* Virtual Camera HUD */}
          <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden flex flex-col justify-between p-4">
            {/* Horizon Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 z-0 pointer-events-none"></div>

            {/* Lane Lines */}
            <div className="absolute inset-x-0 bottom-0 h-[120px] flex justify-center z-10 pointer-events-none">
              <div 
                className="w-1.5 h-full bg-slate-800/80 origin-bottom transition-transform duration-200"
                style={{
                  transform: `perspective(100px) rotateX(45deg) translateX(${(-laneOffset * 60) - (steeringAngle * 0.8)}px)`
                }}
              ></div>
              <div className="w-[120px] h-full flex justify-between absolute bottom-0">
                <div 
                  className="w-1 h-full bg-slate-400 origin-bottom-left transition-transform duration-200"
                  style={{
                    transform: `perspective(100px) rotateX(45deg) rotateY(-15deg) translateX(${-laneOffset * 65}px)`
                  }}
                ></div>
                <div 
                  className="w-1 h-full bg-slate-400 origin-bottom-right transition-transform duration-200"
                  style={{
                    transform: `perspective(100px) rotateX(45deg) rotateY(15deg) translateX(${-laneOffset * 65}px)`
                  }}
                ></div>
              </div>
            </div>

            {/* Dashboard Indicators overlay */}
            <div className="flex justify-between items-start z-20">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1.5 text-center min-w-[70px]">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Speed</span>
                <span className="text-md font-extrabold text-cyan-400 font-mono">{speed}</span>
                <span className="text-[8px] text-slate-500 font-semibold block">km/h</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1.5 text-center min-w-[70px]">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Steer</span>
                <span className="text-md font-extrabold text-indigo-400 font-mono">{steeringAngle}°</span>
                <span className="text-[8px] text-slate-500 font-semibold block">angle</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg px-2.5 py-1.5 text-center min-w-[70px]">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Safety Gap</span>
                <span className="text-md font-extrabold text-emerald-400 font-mono">{distance}m</span>
                <span className="text-[8px] text-slate-500 font-semibold block">front</span>
              </div>
            </div>

            {/* Virtual Steering Wheel Graphic */}
            <div className="flex justify-center items-end h-full z-20 mb-2">
              <div 
                className="w-14 h-14 rounded-full border-4 border-slate-700/80 border-t-transparent flex items-center justify-center transition-transform duration-200"
                style={{ transform: `rotate(${steeringAngle}deg)` }}
              >
                <div className="w-1 h-6 bg-slate-500"></div>
              </div>
            </div>

            {/* Alert bar inside HUD */}
            {apiResponse && apiResponse.risk?.riskScore >= 0.6 && (
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-950/90 border border-red-800 rounded-lg px-4 py-2 text-center z-30 animate-pulse">
                <span className="text-xs font-bold text-red-400 block">⚠️ COLLISION / DEVIATION RISK</span>
                <span className="text-[10px] text-slate-300 capitalize">{apiResponse.risk?.riskLevel} Danger Alert</span>
              </div>
            )}
          </div>

          {/* AI Decision Panel */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">AI Edge Intent & Threat Index</span>
              
              {apiResponse ? (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-[9px] uppercase text-slate-500">Predicted Driver Intent</p>
                    <p className="text-md font-extrabold text-cyan-300 capitalize mt-0.5">
                      {apiResponse.intentPrediction?.predictedIntent?.replace("_", " ")}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Confidence: {apiResponse.intentPrediction?.confidence * 100}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-slate-500">Evaluated Risk Score</p>
                    <p className="text-md font-extrabold text-amber-400 mt-0.5">{apiResponse.risk?.riskScore}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Level: <span className="capitalize font-bold">{apiResponse.risk?.riskLevel}</span></p>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 text-xs py-4 text-center">
                  Sensor stream inactive. Click Transmit or toggle Auto-Stream.
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="text-[10px] text-red-400 bg-red-950/20 border border-red-900/40 rounded p-1.5 mt-2">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Sliders Configuration (Righthand Column) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-slate-850 rounded-xl p-3 text-xs mb-2">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Route Node</span>
              <select 
                value={segment} 
                onChange={(e) => setSegment(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-md px-2 py-1 focus:outline-none w-full text-slate-300"
              >
                <option value="curve_42">Gateway Curve (Curve-42)</option>
                <option value="highway_101">Marine Drive (Highway-101)</option>
                <option value="intersection_alpha">Crawford (Intersection-Alpha)</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">Climate Condition</span>
              <select 
                value={weather} 
                onChange={(e) => setWeather(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-md px-2 py-1 focus:outline-none w-full text-slate-300 capitalize"
              >
                <option value="clear">Clear Skies</option>
                <option value="rain">Heavy Rain</option>
                <option value="fog">Thick Fog</option>
                <option value="snow">Snow/Freeze</option>
              </select>
            </div>
          </div>

          {/* Speed slider */}
          <div className="bg-slate-950/20 border border-slate-850/50 rounded-xl p-3.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Speed Sensor (speed)</span>
              <span className="text-cyan-400 font-mono">{speed} km/h</span>
            </div>
            <input 
              type="range" min="0" max="120" value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Steering Angle */}
          <div className="bg-slate-950/20 border border-slate-850/50 rounded-xl p-3.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Steering Wheel Angle (steeringAngle)</span>
              <span className="text-indigo-400 font-mono">{steeringAngle}°</span>
            </div>
            <input 
              type="range" min="-45" max="45" value={steeringAngle} 
              onChange={(e) => setSteeringAngle(Number(e.target.value))}
              className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Lane Offset */}
          <div className="bg-slate-950/20 border border-slate-850/50 rounded-xl p-3.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Lane Alignment Offset (laneOffset)</span>
              <span className="text-violet-400 font-mono">{laneOffset} meters</span>
            </div>
            <input 
              type="range" min="-1.5" max="1.5" step="0.1" value={laneOffset} 
              onChange={(e) => setLaneOffset(Number(e.target.value))}
              className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>

          {/* Gap Distance */}
          <div className="bg-slate-950/20 border border-slate-850/50 rounded-xl p-3.5">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Front Vehicle Distance Radar (distanceToFrontVehicle)</span>
              <span className="text-emerald-400 font-mono">{distance} meters</span>
            </div>
            <input 
              type="range" min="2" max="100" value={distance} 
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Controls Widgets Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={handleEmergencyBrake}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-900 text-red-400 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              🚨 Emergency Brake
            </button>
            <button
              onClick={() => handleQuickTurn("left")}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer"
            >
              ↩ Swerve Left
            </button>
            <button
              onClick={() => handleQuickTurn("right")}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer"
            >
              ↪ Swerve Right
            </button>
            <button
              onClick={handleResetSensors}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-400 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer"
            >
              ↺ Reset Sensors
            </button>
          </div>

          {/* Stream Trigger Panel */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="auto-stream-toggle"
                checked={isStreaming}
                onChange={(e) => {
                  setIsStreaming(e.target.checked);
                  setStreamCount(0);
                }}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <div>
                <label htmlFor="auto-stream-toggle" className="text-xs font-bold text-slate-300 block cursor-pointer">
                  Auto-Stream Telemetry (1Hz)
                </label>
                <span className="text-[10px] text-slate-500">Pipes sensor arrays continuously every 1 second</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isStreaming && (
                <span className="text-xs text-cyan-400 font-mono font-bold animate-pulse">
                  Packets sent: {streamCount}
                </span>
              )}
              <button
                onClick={handleTransmit}
                disabled={isStreaming}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all ${
                  isStreaming 
                    ? "bg-slate-900 text-slate-600 border border-slate-850" 
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                }`}
              >
                Transmit Packet
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VehicleCockpit;
