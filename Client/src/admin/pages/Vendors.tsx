import { useState } from "react";
import { Search, Plus, Star, Package, TrendingUp, Phone, Mail, Loader2, MapPin, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Badge } from "@/admin/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { useAdminVendors, Vendor } from "@/admin/hooks/useAdminVendors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/admin/components/ui/dialog";
import { Label } from "@/admin/components/ui/label";
import { Textarea } from "@/admin/components/ui/textarea";
import { Checkbox } from "@/admin/components/ui/checkbox";
import { toast } from "@/admin/hooks/use-toast";

const categories = [
  "Vegetables", "Fruits", "Dairy and Eggs", "Herbs and Spices", "Grains and Cereals"
];

export default function Vendors() {
  const { vendors, isLoading, error, addVendor, isAdding } = useAdminVendors();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    farmName: "",
    farmLocation: "",
    farmSize: "",
    aboutFarm: "",
    businessName: "",
    categoriesDealtWith: [] as string[],
  });
  const [farmImage, setFarmImage] = useState<File | null>(null);

  const filteredVendors = vendors.filter((v) => 
    v.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categoriesDealtWith: prev.categoriesDealtWith.includes(cat)
        ? prev.categoriesDealtWith.filter(c => c !== cat)
        : [...prev.categoriesDealtWith, cat]
    }));
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVendor({ ...formData, farmImage });
      toast({ title: "Success", description: "Vendor added successfully" });
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        farmName: "",
        farmLocation: "",
        farmSize: "",
        aboutFarm: "",
        businessName: "",
        categoriesDealtWith: [],
      });
      setFarmImage(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add vendor",
        variant: "destructive",
      });
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
          <h1 className="text-2xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">Manage your vendor partners</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Vendor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVendor} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Farmer Name</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Default: Farmer@123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name</Label>
                  <Input id="farmName" value={formData.farmName} onChange={e => setFormData({...formData, farmName: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmLocation">Location</Label>
                  <Input id="farmLocation" value={formData.farmLocation} onChange={e => setFormData({...formData, farmLocation: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size</Label>
                  <Input id="farmSize" value={formData.farmSize} onChange={e => setFormData({...formData, farmSize: e.target.value})} placeholder="e.g. 5 acres" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-3 p-3 border rounded-lg bg-muted/20">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={formData.categoriesDealtWith.includes(cat)} 
                        onCheckedChange={() => handleToggleCategory(cat)}
                      />
                      <Label htmlFor={`cat-${cat}`} className="text-xs">{cat}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About the Farm</Label>
                <Textarea id="about" value={formData.aboutFarm} onChange={e => setFormData({...formData, aboutFarm: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <Label>Farm Image</Label>
                <Input type="file" accept="image/*" onChange={e => setFarmImage(e.target.files?.[0] || null)} />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isAdding} className="w-full">
                  {isAdding ? "Registering..." : "Add Vendor"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{vendors.length}</p>
            <p className="text-sm text-muted-foreground">Total Vendors</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search vendors..." 
          className="pl-10" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <Card key={vendor._id} className="shadow-card border-0 hover-lift overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={`http://localhost:8000/${vendor.farmImage?.replace(/^\//, '')}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {vendor.farmName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge className="bg-success">Active</Badge>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">{vendor.farmName}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="h-3 w-3" />
                <span>{vendor.farmLocation}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{vendor.farmSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {vendor.categoriesDealtWith[0] || "General"}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{vendor.farmer?.email}</span>
                </div>
                <div className="mt-2 text-xs line-clamp-2 italic">
                  "{vendor.aboutFarm}"
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
