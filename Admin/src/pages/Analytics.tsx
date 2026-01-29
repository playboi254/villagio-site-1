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

const revenueData = [
  { month: "Jul", revenue: 1800000, orders: 420 },
  { month: "Aug", revenue: 2100000, orders: 485 },
  { month: "Sep", revenue: 1950000, orders: 452 },
  { month: "Oct", revenue: 2400000, orders: 530 },
  { month: "Nov", revenue: 2650000, orders: 590 },
  { month: "Dec", revenue: 2900000, orders: 645 },
];

const categoryData = [
  { name: "Vegetables", value: 35, color: "hsl(142, 76%, 36%)" },
  { name: "Fruits", value: 25, color: "hsl(18, 100%, 61%)" },
  { name: "Dairy", value: 20, color: "hsl(199, 89%, 48%)" },
  { name: "Grains", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Others", value: 8, color: "hsl(156, 54%, 13%)" },
];

const vendorPerformance = [
  { name: "Green Valley", orders: 342, revenue: 125 },
  { name: "Sunrise Dairy", orders: 289, revenue: 98 },
  { name: "Fresh Harvest", orders: 256, revenue: 87 },
  { name: "Organic Roots", orders: 198, revenue: 76 },
  { name: "Highland Grains", orders: 167, revenue: 54 },
];

const topProducts = [
  { name: "Fresh Sukuma Wiki", sales: 1245, revenue: 62250 },
  { name: "Organic Tomatoes", sales: 987, revenue: 118440 },
  { name: "Fresh Milk (1L)", sales: 856, revenue: 55640 },
  { name: "Farm Fresh Eggs", sales: 678, revenue: 305100 },
  { name: "Sweet Mangoes", sales: 543, revenue: 43440 },
];

export default function Analytics() {
  const stats = [
    { label: "Total Revenue", value: "KES 2.9M", change: 18, icon: DollarSign, color: "success" },
    { label: "Total Orders", value: "1,284", change: 12, icon: ShoppingCart, color: "accent" },
    { label: "New Customers", value: "234", change: 8, icon: Users, color: "info" },
    { label: "Products Sold", value: "8,456", change: -3, icon: Package, color: "warning" },
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
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(18 100% 61%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(18 100% 61%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(156 15% 90%)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
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
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
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
        {/* Vendor Performance */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(156 15% 90%)" />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(156 54% 13%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="font-bold text-muted-foreground w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <p className="font-semibold text-accent">KES {(product.revenue / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
