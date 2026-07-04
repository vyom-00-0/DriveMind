import { useEffect, useState } from "react";
import PortalSelect from "./pages/PortalSelect";
import AdminLogin from "./pages/AdminLogin";
import VehicleLogin from "./pages/VehicleLogin";
import AdminDashboard from "./pages/AdminDashboard";
import VehicleDashboard from "./pages/VehicleDashboard";

function App() {
  const [portal, setPortal] = useState("select"); // 'select', 'admin', 'vehicle'
  
  // Admin auth states
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // Vehicle auth states
  const [vehicleToken, setVehicleToken] = useState(null);
  const [vehicleUser, setVehicleUser] = useState(null);

  useEffect(() => {
    // Check for existing Admin session
    const storedAdminToken = localStorage.getItem("drivemind_admin_token");
    const storedAdminUser = localStorage.getItem("drivemind_admin_user");
    if (storedAdminToken && storedAdminUser) {
      setAdminToken(storedAdminToken);
      setAdminUser(JSON.parse(storedAdminUser));
      setPortal("admin");
      return;
    }

    // Check for existing Vehicle session
    const storedVehicleToken = localStorage.getItem("active_vehicle_token");
    const storedVehicleId = localStorage.getItem("active_vehicle_id");
    if (storedVehicleToken && storedVehicleId) {
      setVehicleToken(storedVehicleToken);
      setVehicleUser({ vehicleId: storedVehicleId });
      setPortal("vehicle");
    }
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("drivemind_admin_token");
    localStorage.removeItem("drivemind_admin_user");
    setAdminToken(null);
    setAdminUser(null);
    setPortal("select");
  };

  const handleVehicleLogout = () => {
    localStorage.removeItem("active_vehicle_token");
    localStorage.removeItem("active_vehicle_id");
    setVehicleToken(null);
    setVehicleUser(null);
    setPortal("select");
  };

  // Render Portal Selection
  if (portal === "select") {
    return <PortalSelect onSelectPortal={(selected) => setPortal(selected)} />;
  }

  // Render Admin Portal Flow
  if (portal === "admin") {
    if (!adminToken) {
      return (
        <AdminLogin
          onAuthSuccess={(token, user) => {
            setAdminToken(token);
            setAdminUser(user);
          }}
          onBackToSelector={() => setPortal("select")}
        />
      );
    }
    return <AdminDashboard onLogout={handleAdminLogout} user={adminUser} />;
  }

  // Render Vehicle Portal Flow
  if (portal === "vehicle") {
    if (!vehicleToken) {
      return (
        <VehicleLogin
          onAuthSuccess={(token, vehicle) => {
            setVehicleToken(token);
            setVehicleUser(vehicle);
          }}
          onBackToSelector={() => setPortal("select")}
        />
      );
    }
    return <VehicleDashboard onLogout={handleVehicleLogout} vehicle={vehicleUser} />;
  }

  return <PortalSelect onSelectPortal={(selected) => setPortal(selected)} />;
}

export default App;