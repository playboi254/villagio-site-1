import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const colors = ["hsl(142, 76%, 36%)", "hsl(18, 100%, 61%)", "hsl(199, 89%, 48%)", "hsl(38, 92%, 50%)", "hsl(156, 54%, 13%)"];

export default function Analytics() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>
    );
  }

  const revenueData = data.monthlyTrend.map((item: any) => ({
    month: monthNames[item._id.month - 1],
    revenue: item.revenue,
    orders: item.orders
  }));

  const categoryData = data.categoryStats.map((item: any, index: number) => ({
    name: item._id,
    value: item.count,
    color: colors[index % colors.length]
  }));

  const stats = [
    { label: "Total Revenue", value: `KES ${data.totalRevenue?.toLocaleString()}`, change: 0, icon: DollarSign, color: "success" },
    { label: "Total Orders", value: data.totalOrders?.toLocaleString(), change: 0, icon: ShoppingCart, color: "accent" },
    { label: "Total Customers", value: data.totalConsumers?.toLocaleString(), change: 0, icon: Users, color: "info" },
    { label: "Total Products", value: data.totalProducts?.toLocaleString(), change: 0, icon: Package, color: "warning" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your business performance</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${stat.change >= 0 ? "text-success" : "text-destructive"}`}>
                    {stat.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{Math.abs(stat.change)}% vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData.length > 0 ? revenueData : [{month: 'No Data', revenue: 0}]}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(18 100% 61%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(18 100% 61%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(156 15% 90%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(18 100% 61%)" fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{name: 'No Data', value: 1, color: '#ccc'}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No sales data available.</div>
              ) : (
                data.topProducts.map((product: any, index: number) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <span className="font-bold text-muted-foreground w-6">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.totalSold} units sold</p>
                    </div>
                    <p className="font-semibold text-accent">KES {product.revenue?.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Stats Placeholder */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Total Farmers</span>
                    <span className="font-bold text-primary">{data.totalFarmers}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Total Vendors</span>
                    <span className="font-bold text-accent">{data.totalVendors}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Inactive Products</span>
                    <span className="font-bold text-destructive">{data.totalProducts > 0 ? 0 : 0}</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
