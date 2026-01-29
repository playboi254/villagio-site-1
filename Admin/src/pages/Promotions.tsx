import { Tag, Plus, Calendar, Percent, Gift, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const promotions = [
  {
    id: 1,
    name: "New Year Sale",
    code: "NEWYEAR2025",
    discount: "20%",
    type: "percentage",
    startDate: "2024-12-28",
    endDate: "2025-01-05",
    usageLimit: 500,
    usageCount: 234,
    status: "active",
    minOrder: 1000,
  },
  {
    id: 2,
    name: "Free Delivery Week",
    code: "FREEDEL",
    discount: "Free Delivery",
    type: "shipping",
    startDate: "2024-12-25",
    endDate: "2025-01-01",
    usageLimit: 1000,
    usageCount: 756,
    status: "active",
    minOrder: 500,
  },
  {
    id: 3,
    name: "First Order Discount",
    code: "WELCOME15",
    discount: "15%",
    type: "percentage",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    usageLimit: null,
    usageCount: 2341,
    status: "active",
    minOrder: 0,
  },
  {
    id: 4,
    name: "Christmas Special",
    code: "XMAS2024",
    discount: "25%",
    type: "percentage",
    startDate: "2024-12-20",
    endDate: "2024-12-26",
    usageLimit: 300,
    usageCount: 300,
    status: "expired",
    minOrder: 2000,
  },
  {
    id: 5,
    name: "Flash Sale",
    code: "FLASH50",
    discount: "50%",
    type: "percentage",
    startDate: "2025-01-15",
    endDate: "2025-01-16",
    usageLimit: 100,
    usageCount: 0,
    status: "scheduled",
    minOrder: 3000,
  },
];

const quickTemplates = [
  { name: "10% Off", icon: Percent },
  { name: "Free Delivery", icon: Gift },
  { name: "Buy 1 Get 1", icon: Tag },
  { name: "Holiday Sale", icon: Calendar },
];

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  expired: "bg-muted text-muted-foreground",
  scheduled: "bg-info/10 text-info",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  active: CheckCircle,
  expired: XCircle,
  scheduled: Clock,
};

export default function Promotions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
          <p className="text-muted-foreground">Create and manage promotional campaigns</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Total Promotions</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">5</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">3,587</p>
            <p className="text-sm text-muted-foreground">Total Redemptions</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">KES 456K</p>
            <p className="text-sm text-muted-foreground">Total Savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickTemplates.map((template) => (
              <Button key={template.name} variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-accent hover:text-accent-foreground">
                <template.icon className="h-6 w-6" />
                <span>{template.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promotions List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => {
          const StatusIcon = statusIcons[promo.status];
          const usagePercent = promo.usageLimit ? (promo.usageCount / promo.usageLimit) * 100 : 0;

          return (
            <Card key={promo.id} className="shadow-card border-0 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{promo.name}</h3>
                    <code className="text-sm bg-muted px-2 py-1 rounded mt-1 inline-block">{promo.code}</code>
                  </div>
                  <Badge className={statusStyles[promo.status]}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {promo.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-semibold text-accent">{promo.discount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min. Order</span>
                    <span className="font-medium">
                      {promo.minOrder > 0 ? `KES ${promo.minOrder.toLocaleString()}` : "No minimum"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Period</span>
                    <span className="font-medium">
                      {new Date(promo.startDate).toLocaleDateString("en-KE", { month: "short", day: "numeric" })} -
                      {new Date(promo.endDate).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  {promo.usageLimit && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Usage</span>
                        <span className="font-medium">{promo.usageCount} / {promo.usageLimit}</span>
                      </div>
                      <Progress value={usagePercent} className="h-2" />
                    </div>
                  )}

                  {!promo.usageLimit && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        {promo.usageCount.toLocaleString()} redemptions (unlimited)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
