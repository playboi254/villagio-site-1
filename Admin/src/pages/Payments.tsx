import { DollarSign, CreditCard, Smartphone, Building2, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { date: "Dec 24", revenue: 245000, commission: 24500 },
  { date: "Dec 25", revenue: 312000, commission: 31200 },
  { date: "Dec 26", revenue: 287000, commission: 28700 },
  { date: "Dec 27", revenue: 356000, commission: 35600 },
  { date: "Dec 28", revenue: 298000, commission: 29800 },
  { date: "Dec 29", revenue: 423000, commission: 42300 },
  { date: "Dec 30", revenue: 389000, commission: 38900 },
];

const paymentMethods = [
  { name: "M-Pesa", value: 65, color: "hsl(142, 76%, 36%)" },
  { name: "Card", value: 25, color: "hsl(18, 100%, 61%)" },
  { name: "Bank Transfer", value: 10, color: "hsl(199, 89%, 48%)" },
];

const transactions = [
  { id: "TXN-001", order: "ORD-2024-001", customer: "John Kamau", method: "M-Pesa", amount: 2450, status: "completed", date: "2024-12-30" },
  { id: "TXN-002", order: "ORD-2024-002", customer: "Sarah Wanjiku", method: "Card", amount: 1820, status: "completed", date: "2024-12-30" },
  { id: "TXN-003", order: "ORD-2024-003", customer: "Peter Odhiambo", method: "M-Pesa", amount: 4200, status: "pending", date: "2024-12-29" },
  { id: "TXN-004", order: "ORD-2024-004", customer: "Grace Muthoni", method: "Bank Transfer", amount: 980, status: "completed", date: "2024-12-29" },
  { id: "TXN-005", order: "ORD-2024-005", customer: "David Njoroge", method: "M-Pesa", amount: 3150, status: "completed", date: "2024-12-28" },
  { id: "TXN-006", order: "ORD-2024-006", customer: "Mary Akinyi", method: "Card", amount: 2100, status: "refunded", date: "2024-12-28" },
];

const methodIcons: Record<string, typeof Smartphone> = {
  "M-Pesa": Smartphone,
  Card: CreditCard,
  "Bank Transfer": Building2,
};

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  refunded: "bg-destructive/10 text-destructive",
};

export default function Payments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Track revenue and manage transactions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">KES 2.9M</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>18% vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission Earned</p>
                <p className="text-2xl font-bold mt-1">KES 290K</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>12% vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold mt-1">KES 156K</p>
                <p className="text-sm text-muted-foreground mt-2">12 vendors</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-2xl font-bold mt-1">KES 45K</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>8% refund rate</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(18 100% 61%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(18 100% 61%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(156 54% 13%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(156 54% 13%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(156 15% 90%)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(18 100% 61%)" fill="url(#colorRevenue2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="commission" stroke="hsl(156 54% 13%)" fill="url(#colorCommission)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {paymentMethods.map((method) => {
                const Icon = methodIcons[method.name];
                return (
                  <div key={method.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{method.name}</span>
                    </div>
                    <span className="font-medium">{method.value}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => {
                const Icon = methodIcons[txn.method];
                return (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>{txn.order}</TableCell>
                    <TableCell>{txn.customer}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {txn.method}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">KES {txn.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[txn.status]}>{txn.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
