import { Truck, MapPin, Clock, CheckCircle, Phone, Navigation, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Badge } from "@/admin/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { Progress } from "@/admin/components/ui/progress";
import { useAdminOrders } from "@/admin/hooks/useAdminOrders";

const statusStyles: Record<string, string> = {
  "picking-up": "bg-warning/10 text-warning",
  "in-transit": "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
};

export default function Delivery() {
  const { orders, isLoading } = useAdminOrders();
  
  const activeDeliveries = orders
    .filter(o => ['confirmed', 'shipped'].includes(o.status))
    .map(o => ({
      id: o._id.slice(-8).toUpperCase(),
      orderId: o._id,
      driver: "Express Rider", // Mock driver for now
      phone: o.deliveryAddress.phone,
      from: "Main Warehouse",
      to: o.deliveryAddress.city,
      customer: o.consumer?.name || "Guest",
      status: o.status === 'confirmed' ? 'picking-up' : 'in-transit',
      progress: o.status === 'confirmed' ? 30 : 75,
      eta: o.status === 'confirmed' ? "45 min" : "15 min",
    }));

  const stats = [
    { label: "Active Deliveries", value: activeDeliveries.length.toString(), icon: Truck, color: "emerald" },
    { label: "Pending Setup", value: orders.filter(o => o.status === 'pending').length.toString(), icon: Clock, color: "orange" },
    { label: "Completed Recent", value: orders.filter(o => o.status === 'delivered').length.toString(), icon: CheckCircle, color: "blue" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Delivery & Logistics</h1>
        <p className="text-muted-foreground">Track and manage deliveries in real-time</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Real Google Maps Integration via Iframe (Simulation) */}
        <Card className="shadow-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-accent" />
              Live Delivery Map (OSM - Nairobi)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="aspect-video rounded-xl overflow-hidden border bg-muted relative">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.65%2C-1.45%2C37.05%2C-1.15&amp;layer=mapnik&amp;marker=-1.2921%2C36.8219"
              ></iframe>
              <div className="absolute inset-x-4 bottom-4 p-3 bg-white/90 backdrop-blur rounded-lg shadow-lg border flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-accent">Real-Time Simulation Active</p>
                  <p className="text-[10px] text-muted-foreground">Tracking {activeDeliveries.length} live units in Nairobi Area</p>
                </div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-medium">Live</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drivers List */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Top Carriers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Villagio Express 1", rating: 4.9, status: "active" },
              { name: "Villagio Express 2", rating: 4.8, status: "active" },
              { name: "Outside Courier", rating: 4.7, status: "online" },
            ].map((driver) => (
              <div key={driver.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} />
                  <AvatarFallback>{driver.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">⭐ {driver.rating} Rating</p>
                </div>
                <Badge className="bg-success">{driver.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>On-Route Shipments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.id} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${delivery.driver}`} />
                    <AvatarFallback>{delivery.driver[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{delivery.driver}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {delivery.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusStyles[delivery.status]}>{delivery.status.replace("-", " ")}</Badge>
                  <Badge variant="secondary" className="text-[10px]">ID: {delivery.id}</Badge>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Origin</p>
                    <p className="text-xs font-medium">{delivery.from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Destination</p>
                    <p className="text-xs font-medium">{delivery.to}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Ordered By</p>
                  <p className="text-xs font-medium">{delivery.customer}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Shipment Progress</span>
                  <span className="font-bold text-accent">ETA: {delivery.eta}</span>
                </div>
                <Progress value={delivery.progress} className="h-1.5" />
              </div>
            </div>
          ))}
          {activeDeliveries.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No active shipments at the moment.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
