import { Search, Plus, Star, Package, TrendingUp, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const vendors = [
  {
    id: 1,
    name: "Green Valley Farms",
    category: "Vegetables",
    location: "Kiambu County",
    rating: 4.9,
    products: 45,
    orders: 342,
    revenue: 125000,
    growth: 12,
    phone: "+254 712 345 678",
    email: "info@greenvalley.co.ke",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GV",
  },
  {
    id: 2,
    name: "Sunrise Dairy",
    category: "Dairy Products",
    location: "Nakuru County",
    rating: 4.8,
    products: 28,
    orders: 289,
    revenue: 98000,
    growth: 8,
    phone: "+254 723 456 789",
    email: "sales@sunrisedairy.co.ke",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SD",
  },
  {
    id: 3,
    name: "Fresh Harvest Co.",
    category: "Fruits",
    location: "Machakos County",
    rating: 4.7,
    products: 52,
    orders: 256,
    revenue: 87000,
    growth: 15,
    phone: "+254 734 567 890",
    email: "hello@freshharvest.co.ke",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FH",
  },
  {
    id: 4,
    name: "Organic Roots",
    category: "Organic Produce",
    location: "Nairobi County",
    rating: 4.9,
    products: 38,
    orders: 198,
    revenue: 76000,
    growth: 22,
    phone: "+254 745 678 901",
    email: "contact@organicroots.co.ke",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=OR",
  },
  {
    id: 5,
    name: "Farm Fresh Poultry",
    category: "Poultry",
    location: "Kajiado County",
    rating: 4.6,
    products: 15,
    orders: 167,
    revenue: 54000,
    growth: -3,
    phone: "+254 756 789 012",
    email: "orders@ffpoultry.co.ke",
    status: "inactive",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FF",
  },
  {
    id: 6,
    name: "Highland Grains",
    category: "Grains & Cereals",
    location: "Uasin Gishu County",
    rating: 4.8,
    products: 22,
    orders: 234,
    revenue: 92000,
    growth: 10,
    phone: "+254 767 890 123",
    email: "sales@highlandgrains.co.ke",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=HG",
  },
];

export default function Vendors() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">Manage your vendor partners</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">48</p>
            <p className="text-sm text-muted-foreground">Total Vendors</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">42</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">1,248</p>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">KES 2.1M</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search vendors..." className="pl-10" />
      </div>

      {/* Vendor Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="shadow-card border-0 hover-lift overflow-hidden">
            <div className="h-2 bg-gradient-accent" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={vendor.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {vendor.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <Badge variant={vendor.status === "active" ? "default" : "secondary"} className={vendor.status === "active" ? "bg-success" : ""}>
                  {vendor.status}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{vendor.category} • {vendor.location}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium">{vendor.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{vendor.products} products</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`h-4 w-4 ${vendor.growth >= 0 ? "text-success" : "text-destructive"}`} />
                  <span className={vendor.growth >= 0 ? "text-success" : "text-destructive"}>
                    {vendor.growth >= 0 ? "+" : ""}{vendor.growth}%
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">KES {(vendor.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
