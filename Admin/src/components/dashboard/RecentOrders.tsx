import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface RecentOrdersProps {
  orders: any[];
  isLoading: boolean;
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-info/10 text-info border-info/20",
  shipped: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading recent orders...
        </CardContent>
      </Card>
    );
  }

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
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent orders.</div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {order.consumer?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.consumer?.name || "Unknown Customer"}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{order.deliveryAddress?.city}, {order.deliveryAddress?.county}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order._id.substring(0, 8).toUpperCase()} • {order.items?.length || 0} items
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-semibold text-foreground">KES {order.totalAmount?.toLocaleString()}</p>
                  <Badge variant="outline" className={statusStyles[order.status]}>
                    {order.status.replace("-", " ")}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
