import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import ErrorBoundary from "@/components/ErrorBoundary";

// ─── Client pages ─────────────────────────────────────────────────────────────
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OrderTracking from "./pages/OrderTracking";
import VendorApplication from "./pages/VendorApplication";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// ─── Admin (lazy-loaded so it doesn't bloat the client bundle) ────────────────
// These are imported from src/admin/ — see setup guide
const AdminApp = lazy(() => import('./admin/AdminApp'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 min
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* ── Client routes ── */}
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/vendors/:slug" element={<VendorDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="/vendor-application" element={<VendorApplication />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />

                {/* ── Admin routes (hidden under /admin) ── */}
                <Route
                  path="/admin/*"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={
                        <div className="min-h-screen flex items-center justify-center bg-background">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Loading admin...</p>
                          </div>
                        </div>
                      }>
                        <AdminApp />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <WhatsAppWidget />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;