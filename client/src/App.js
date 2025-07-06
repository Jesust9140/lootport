import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Inventory from "./pages/Inventory";
import Marketplace from "./components/Marketplace";
import InventoryManager from "./components/InventoryManager";
import TransactionHistory from "./components/TransactionHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import DebugAuth from "./components/DebugAuth";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <DebugAuth />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="my-inventory" element={
            <ProtectedRoute>
              <InventoryManager />
            </ProtectedRoute>
          } />
          <Route path="transactions" element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          } />
          <Route path="dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;