// Client/src/admin/AdminApp.tsx
// This is the Admin app mounted at /admin/* inside the Client

import { AdminAuthProvider } from "@/admin/context/AuthContext";
import ProtectedRoute from "@/admin/components/ProtectedRoutes";
import { DashboardLayout } from "@/admin/components/layout/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";

// Admin pages — imported from src/admin/pages/
import Login from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import Orders from "@/admin/pages/Orders";
import Vendors from "@/admin/pages/Vendors";
import Products from "@/admin/pages/Products";
import Customers from "@/admin/pages/Customers";
import Analytics from "@/admin/pages/Analytics";
import Delivery from "@/admin/pages/Delivery";
import Payments from "@/admin/pages/Payments";
import Promotions from "@/admin/pages/Promotions";
import Settings from "@/admin/pages/Settings";
import NotFound from "@/admin/pages/NotFound";

// Admin gets its own QueryClient so it doesn't share cache with the client
const adminQueryClient = new QueryClient();

const AdminApp = () => (
  <QueryClientProvider client={adminQueryClient}>
    <AdminAuthProvider>
      {/* 
        All admin routes are relative to /admin
        e.g. /admin/login, /admin/orders, /admin/products
      */}
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default AdminApp;