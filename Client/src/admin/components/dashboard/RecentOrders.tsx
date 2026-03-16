import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Badge } from "@/admin/components/ui/badge";
import { Button } from "@/admin/components/ui/button";
import { ArrowRight, MapPin, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-info/10 text-info border-info/20",
  shipped: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders({ orders = [] }: { orders?: any[] }) {
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
          {orders.length > 0 ? orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary uppercase">
                    {(order.consumer?.name || "C").split(" ").map((n: string) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{order.consumer?.name || "Customer"}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{order.deliveryAddress?.city || "Nairobi"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono uppercase">
                    #{order._id.slice(-6)} • {order.items?.length || 0} items
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="font-semibold text-foreground">KES {order.totalAmount?.toLocaleString()}</p>
                <Badge variant="outline" className={statusStyles[order.status] || statusStyles.pending}>
                  {order.status}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )) : (
            <div className="text-center py-6 text-muted-foreground">
              No recent orders found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
