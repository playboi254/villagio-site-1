import { useAdminCustomers } from "@/admin/hooks/useAdminCustomers";
import { Loader2, Search, Filter, Phone, Mail, MapPin, ShoppingBag, MoreVertical, Trash2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/admin/components/ui/dropdown-menu";
import { Card, CardContent } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Badge } from "@/admin/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { toast } from "@/admin/hooks/use-toast";

const tierStyles: Record<string, string> = {
  platinum: "bg-gradient-to-r from-slate-600 to-slate-400 text-white",
  gold: "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white",
  silver: "bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800",
  bronze: "bg-gradient-to-r from-amber-700 to-amber-600 text-white",
};

export default function Customers() {
  const { customers, isLoading, deleteCustomer, isDeleting } = useAdminCustomers();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteCustomer(id);
      toast({ title: "User deleted", description: `${name} has been removed.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
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
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{customers.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">{customers.length}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-accent">{customers.filter(c => (c as any).userType === 'admin').length}</p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">KES 2.4M</p>
            <p className="text-sm text-muted-foreground">Est. Revenue</p>
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
        {customers.map((customer) => {
          const c = customer as any;
          const tier = c.userType === 'admin' ? 'platinum' : 'silver';
          return (
            <Card key={customer._id} className="shadow-card border-0 hover-lift relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(customer._id, customer.name)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={c.avatar ? `http://localhost:8000/${c.avatar.replace(/^\//,'')}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                      <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground pr-8">{customer.name}</h3>
                      <Badge className={tierStyles[tier]} variant="secondary">
                        {tier}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={c.userType === "admin" ? "default" : "secondary"}>
                    {c.userType || 'customer'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground truncate" title={customer.email}>
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{c.location || "Nairobi"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{Math.floor(Math.random() * 5)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Active</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
