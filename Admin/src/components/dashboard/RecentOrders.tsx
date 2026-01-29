import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const orders = [
  {
    id: "ORD-2024-001",
    customer: "John Kamau",
    location: "Westlands, Nairobi",
    items: 5,
    total: 2450,
    status: "delivered",
    time: "2 hours ago",
  },
  {
    id: "ORD-2024-002",
    customer: "Sarah Wanjiku",
    location: "Karen, Nairobi",
    items: 3,
    total: 1820,
    status: "in-transit",
    time: "3 hours ago",
  },
  {
    id: "ORD-2024-003",
    customer: "Peter Odhiambo",
    location: "Kilimani, Nairobi",
    items: 8,
    total: 4200,
    status: "processing",
    time: "4 hours ago",
  },
  {
    id: "ORD-2024-004",
    customer: "Grace Muthoni",
    location: "Lavington, Nairobi",
    items: 2,
    total: 980,
    status: "pending",
    time: "5 hours ago",
  },
  {
    id: "ORD-2024-005",
    customer: "David Njoroge",
    location: "Runda, Nairobi",
    items: 6,
    total: 3150,
    status: "delivered",
    time: "6 hours ago",
  },
];

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-info/10 text-info border-info/20",
  "in-transit": "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent" asChild>
            <Link to="/orders">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {order.customer.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{order.customer}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{order.location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.id} • {order.items} items
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="font-semibold text-foreground">KES {order.total.toLocaleString()}</p>
                <Badge variant="outline" className={statusStyles[order.status]}>
                  {order.status.replace("-", " ")}
                </Badge>
                <p className="text-xs text-muted-foreground">{order.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
