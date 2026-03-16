import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Badge } from "@/admin/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";

const vendors = [
  {
    name: "Green Valley Farms",
    category: "Vegetables",
    rating: 4.9,
    orders: 342,
    revenue: 125000,
    growth: 12,
  },
  {
    name: "Sunrise Dairy",
    category: "Dairy Products",
    rating: 4.8,
    orders: 289,
    revenue: 98000,
    growth: 8,
  },
  {
    name: "Fresh Harvest Co.",
    category: "Fruits",
    rating: 4.7,
    orders: 256,
    revenue: 87000,
    growth: 15,
  },
  {
    name: "Organic Roots",
    category: "Organic Produce",
    rating: 4.9,
    orders: 198,
    revenue: 76000,
    growth: 22,
  },
];

export function TopVendors() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Top Performing Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {vendors.map((vendor, index) => (
            <div
              key={vendor.name}
              className="p-4 rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 hover-lift"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                  {index + 1}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {vendor.category}
                </Badge>
              </div>
              <h4 className="font-semibold text-foreground mb-2">{vendor.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">{vendor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Orders</span>
                  <span className="font-medium">{vendor.orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">KES {(vendor.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Growth</span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">+{vendor.growth}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
