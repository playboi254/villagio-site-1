import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { date: "Dec 1", revenue: 4200, orders: 45 },
  { date: "Dec 5", revenue: 5100, orders: 52 },
  { date: "Dec 10", revenue: 4800, orders: 48 },
  { date: "Dec 15", revenue: 6200, orders: 65 },
  { date: "Dec 20", revenue: 7100, orders: 72 },
  { date: "Dec 25", revenue: 8500, orders: 88 },
  { date: "Dec 30", revenue: 9200, orders: 95 },
];

export function SalesChart({ data = [] }: { data?: any[] }) {
  // Format data for Recharts: map month number to name
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chartData = data.length > 0 ? data.map(item => ({
    date: monthNames[item._id.month],
    revenue: item.revenue,
    orders: item.orders
  })) : [
    { date: "Dec 1", revenue: 4200, orders: 45 },
    { date: "Dec 5", revenue: 5100, orders: 52 },
    { date: "Dec 10", revenue: 4800, orders: 48 },
    { date: "Dec 15", revenue: 6200, orders: 65 },
    { date: "Dec 20", revenue: 7100, orders: 72 },
    { date: "Dec 25", revenue: 8500, orders: 88 },
    { date: "Dec 30", revenue: 9200, orders: 95 },
  ];
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Orders</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(18 100% 61%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(18 100% 61%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(156 54% 13%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(156 54% 13%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(156 15% 90%)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(156 10% 45%)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(156 10% 45%)", fontSize: 12 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px -5px rgba(15, 51, 37, 0.15)",
                }}
                labelStyle={{ color: "hsl(156 54% 13%)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(18 100% 61%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="hsl(156 54% 13%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
