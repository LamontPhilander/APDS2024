import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import PaymentsPortal from "./components/PaymentsPortal";
import Dashboard from "./components/Dashboard";
import CustomerPayment from "./components/CustomerPayment.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerPayment />
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
