import { Search, Filter, Phone, Mail, MapPin, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const customers = [
  {
    id: 1,
    name: "John Kamau",
    email: "john.kamau@email.com",
    phone: "+254 712 345 678",
    location: "Westlands, Nairobi",
    orders: 42,
    totalSpent: 125000,
    tier: "platinum",
    status: "active",
    lastOrder: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Wanjiku",
    email: "sarah.w@email.com",
    phone: "+254 723 456 789",
    location: "Karen, Nairobi",
    orders: 28,
    totalSpent: 89000,
    tier: "gold",
    status: "active",
    lastOrder: "1 day ago",
  },
  {
    id: 3,
    name: "Peter Odhiambo",
    email: "peter.o@email.com",
    phone: "+254 734 567 890",
    location: "Kilimani, Nairobi",
    orders: 15,
    totalSpent: 45000,
    tier: "silver",
    status: "active",
    lastOrder: "3 days ago",
  },
  {
    id: 4,
    name: "Grace Muthoni",
    email: "grace.m@email.com",
    phone: "+254 745 678 901",
    location: "Lavington, Nairobi",
    orders: 8,
    totalSpent: 22000,
    tier: "bronze",
    status: "inactive",
    lastOrder: "2 weeks ago",
  },
  {
    id: 5,
    name: "David Njoroge",
    email: "david.n@email.com",
    phone: "+254 756 789 012",
    location: "Runda, Nairobi",
    orders: 56,
    totalSpent: 178000,
    tier: "platinum",
    status: "active",
    lastOrder: "5 hours ago",
  },
  {
    id: 6,
    name: "Mary Akinyi",
    email: "mary.a@email.com",
    phone: "+254 767 890 123",
    location: "Parklands, Nairobi",
    orders: 21,
    totalSpent: 67000,
    tier: "gold",
    status: "active",
    lastOrder: "1 day ago",
  },
];

const tierStyles: Record<string, string> = {
  platinum: "bg-gradient-to-r from-slate-600 to-slate-400 text-white",
  gold: "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white",
  silver: "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800",
  bronze: "bg-gradient-to-r from-amber-700 to-amber-600 text-white",
};

export default function Customers() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">2,847</p>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">2,156</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">145</p>
            <p className="text-sm text-muted-foreground">Platinum Members</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">KES 4.2M</p>
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Customer Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.id} className="shadow-card border-0 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                    <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{customer.name}</h3>
                    <Badge className={tierStyles[customer.tier]} variant="secondary">
                      {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                    </Badge>
                  </div>
                </div>
                <Badge variant={customer.status === "active" ? "default" : "secondary"} className={customer.status === "active" ? "bg-success" : ""}>
                  {customer.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{customer.orders}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div>
                  <p className="font-semibold">KES {(customer.totalSpent / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Lifetime Value</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">Last order: {customer.lastOrder}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
