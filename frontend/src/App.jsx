import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login.jsx";
import PaymentsPortal from "./components/PaymentsPortal";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <PaymentsPortal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
