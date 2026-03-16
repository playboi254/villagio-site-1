import { useState } from "react";
import { Tag, Plus, Percent, Gift, Clock, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Badge } from "@/admin/components/ui/badge";
import { Progress } from "@/admin/components/ui/progress";
import { useAdminPromotions } from "@/admin/hooks/useAdminPromotions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/admin/components/ui/dialog";
import { Label } from "@/admin/components/ui/label";
import { Input } from "@/admin/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/admin/components/ui/select";
import { toast } from "@/admin/hooks/use-toast";

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
  const { promotions, isLoading, createPromotion, deletePromotion, isCreating } = useAdminPromotions();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discount: "",
    type: "percentage",
    startDate: "",
    endDate: "",
    usageLimit: "",
    minOrder: "0",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPromotion({
        ...formData,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        minOrder: parseFloat(formData.minOrder),
      });
      toast({ title: "Success", description: "Promotion created successfully" });
      setIsCreateDialogOpen(false);
      setFormData({
        name: "", code: "", discount: "", type: "percentage", 
        startDate: "", endDate: "", usageLimit: "", minOrder: "0"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create promotion",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await deletePromotion(id);
      toast({ title: "Deleted", description: "Promotion removed successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
          <p className="text-muted-foreground">Create and manage promotional campaigns</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Promotional Offer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="p-name">Campaign Name</Label>
                <Input id="p-name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Summer Sale" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-code">Promo Code</Label>
                  <Input id="p-code" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} required placeholder="SAVE20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-type">Type</Label>
                  <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
                    <SelectTrigger id="p-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-discount">Value ({formData.type === 'percentage' ? '%' : 'KES'})</Label>
                  <Input id="p-discount" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} required placeholder="e.g. 20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-min">Min. Order (KES)</Label>
                  <Input id="p-min" type="number" value={formData.minOrder} onChange={e => setFormData({...formData, minOrder: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-start">Start Date</Label>
                  <Input id="p-start" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-end">End Date</Label>
                  <Input id="p-end" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-limit">Usage Limit (Optional)</Label>
                <Input id="p-limit" type="number" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} placeholder="e.g. 100" />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isCreating} className="w-full">
                  {isCreating ? "Creating..." : "Launch Campaign"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{promotions.length}</p>
            <p className="text-sm text-muted-foreground">Total Campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Active & Upcoming Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => {
              const StatusIcon = statusIcons[promo.status] || CheckCircle;
              const usagePercent = promo.usageLimit ? (promo.usageCount / promo.usageLimit) * 100 : 0;

              return (
                <Card key={promo._id} className="border shadow-sm hover:shadow-md transition-shadow relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(promo._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4 pr-6">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{promo.name}</h3>
                        <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block font-bold text-accent">{promo.code}</code>
                      </div>
                      <Badge className={statusStyles[promo.status] || "bg-muted"}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {promo.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-bold text-emerald-600">
                          {promo.type === 'percentage' ? `${promo.discount}%` : 
                           promo.type === 'shipping' ? 'Free Shipping' : `KES ${promo.discount}`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Validity</span>
                        <span className="text-xs font-medium">
                          {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                        </span>
                      </div>

                      {promo.usageLimit && (
                        <div className="space-y-1.5 pt-2 border-t">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">Redeemed</span>
                            <span>{promo.usageCount} / {promo.usageLimit}</span>
                          </div>
                          <Progress value={usagePercent} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {promotions.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                No active campaigns. Start by creating one!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
