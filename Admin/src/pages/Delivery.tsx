import { Truck, MapPin, Clock, CheckCircle, Phone, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const deliveryStats = [
  { label: "Active Deliveries", value: "24", icon: Truck, color: "accent" },
  { label: "Completed Today", value: "86", icon: CheckCircle, color: "success" },
  { label: "Avg. Delivery Time", value: "42 min", icon: Clock, color: "info" },
  { label: "Success Rate", value: "98.5%", icon: Navigation, color: "warning" },
];

const activeDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-2024-001",
    driver: "James Mwangi",
    phone: "+254 712 345 678",
    from: "Green Valley Farms",
    to: "Westlands, Nairobi",
    customer: "John Kamau",
    status: "in-transit",
    progress: 65,
    eta: "15 min",
  },
  {
    id: "DEL-002",
    orderId: "ORD-2024-002",
    driver: "Paul Kibet",
    phone: "+254 723 456 789",
    from: "Sunrise Dairy",
    to: "Karen, Nairobi",
    customer: "Sarah Wanjiku",
    status: "picking-up",
    progress: 25,
    eta: "35 min",
  },
  {
    id: "DEL-003",
    orderId: "ORD-2024-003",
    driver: "Michael Otieno",
    phone: "+254 734 567 890",
    from: "Fresh Harvest Co.",
    to: "Kilimani, Nairobi",
    customer: "Peter Odhiambo",
    status: "delivered",
    progress: 100,
    eta: "Completed",
  },
];

const drivers = [
  { name: "James Mwangi", deliveries: 156, rating: 4.9, status: "active" },
  { name: "Paul Kibet", deliveries: 142, rating: 4.8, status: "active" },
  { name: "Michael Otieno", deliveries: 128, rating: 4.7, status: "active" },
  { name: "David Wafula", deliveries: 98, rating: 4.9, status: "offline" },
];

const statusStyles: Record<string, string> = {
  "picking-up": "bg-warning/10 text-warning",
  "in-transit": "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
};

export default function Delivery() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Delivery & Logistics</h1>
        <p className="text-muted-foreground">Track and manage deliveries in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {deliveryStats.map((stat) => (
          <Card key={stat.label} className="shadow-card border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
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
        {/* Map Placeholder */}
        <Card className="shadow-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Delivery Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Map View</p>
                <p className="text-sm">Real-time delivery tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Performance */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Top Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} />
                  <AvatarFallback>{driver.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-muted-foreground">{driver.deliveries} deliveries</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">⭐ {driver.rating}</p>
                  <Badge variant={driver.status === "active" ? "default" : "secondary"} className={driver.status === "active" ? "bg-success" : ""}>
                    {driver.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Deliveries */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.id} className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${delivery.driver}`} />
                    <AvatarFallback>{delivery.driver.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{delivery.driver}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {delivery.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusStyles[delivery.status]}>{delivery.status.replace("-", " ")}</Badge>
                  <Badge variant="outline">{delivery.id}</Badge>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-sm font-medium">{delivery.from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="text-sm font-medium">{delivery.to}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{delivery.customer}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">ETA: {delivery.eta}</span>
                </div>
                <Progress value={delivery.progress} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
