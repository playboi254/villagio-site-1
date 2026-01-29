import { ShoppingCart, Store, DollarSign, Truck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopVendors } from "@/components/dashboard/TopVendors";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Barrack! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with Villagio today.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow-accent">
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="1,284"
          change={{ value: 12, trend: "up" }}
          icon={ShoppingCart}
          iconColor="accent"
        />
        <StatCard
          title="Active Vendors"
          value="48"
          change={{ value: 5, trend: "up" }}
          icon={Store}
          iconColor="primary"
        />
        <StatCard
          title="Revenue"
          value="KES 2.4M"
          change={{ value: 18, trend: "up" }}
          icon={DollarSign}
          iconColor="success"
        />
        <StatCard
          title="Deliveries"
          value="856"
          change={{ value: 3, trend: "down" }}
          icon={Truck}
          iconColor="warning"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <TopVendors />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button size="lg" className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-glow-accent">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
