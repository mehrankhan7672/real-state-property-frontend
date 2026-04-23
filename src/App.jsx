// App.js
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/auth/Login";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import AgentDashboard from "./pages/Dashboard/AgentDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import Home from "./pages/Home/Home";
import Register from "./pages/auth/Register";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
        <Route path="/customerDashboard" element={<CustomerDashboard />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["agent"]} />}>
        <Route path="/agentDashboard" element={<AgentDashboard />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
