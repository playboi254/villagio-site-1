import { ShoppingCart, Store, DollarSign, Truck, Plus, Loader2, Package } from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { StatCard } from "@/admin/components/dashboard/StatCard";
import { SalesChart } from "@/admin/components/dashboard/SalesChart";
import { RecentOrders } from "@/admin/components/dashboard/RecentOrders";
import { TopVendors } from "@/admin/components/dashboard/TopVendors";
import { useAdminStats } from "@/admin/hooks/useAdminStats";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { dashboard, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const {
    totalOrders = 0,
    totalFarmers = 0,
    totalRevenue = 0,
    totalProducts = 0,
    recentOrders = []
  } = dashboard || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Barrack! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with Villagio today.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow-accent" asChild>
          <Link to="/admin/orders">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          change={{ value: 12, trend: "up" }}
          icon={ShoppingCart}
          iconColor="accent"
        />
        <StatCard
          title="Active Farmers"
          value={totalFarmers.toString()}
          change={{ value: 5, trend: "up" }}
          icon={Store}
          iconColor="primary"
        />
        <StatCard
          title="Total Revenue"
          value={`KES ${(totalRevenue / 1000).toFixed(1)}K`}
          change={{ value: 18, trend: "up" }}
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Total Products"
          value={totalProducts.toString()}
          change={{ value: 3, trend: "up" }}
          icon={Package}
          iconColor="warning"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={dashboard?.monthlyTrend} />
        </div>
        <div className="lg:col-span-1">
          <TopVendors />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button size="lg" className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-glow-accent" asChild>
          <Link to="/admin/orders">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
