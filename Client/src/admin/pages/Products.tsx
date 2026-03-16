import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Package, Loader2, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Badge } from "@/admin/components/ui/badge";
import { useAdminProducts, Product } from "@/admin/hooks/useAdminProducts";
import { useAdminVendors } from "@/admin/hooks/useAdminVendors";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/admin/components/ui/select";
import { toast } from "@/admin/hooks/use-toast";

const categories = [
  { name: "Vegetables", color: "bg-success" },
  { name: "Fruits", color: "bg-accent" },
  { name: "Dairy and Eggs", color: "bg-info" },
  { name: "Herbs and Spices", color: "bg-warning" },
  { name: "Grains and Cereals", color: "bg-primary" },
];

export default function Products() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct, isAdding, isUpdating } = useAdminProducts();
  const { vendors } = useAdminVendors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Vegetables",
    price: "",
    quantity: "",
    unit: "kg",
    farmerId: "",
  });
  const [images, setImages] = useState<File[]>([]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "Vegetables",
      price: "",
      quantity: "",
      unit: "kg",
      farmerId: "",
    });
    setImages([]);
    setEditingProduct(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    const farmerId = typeof product.farmer === 'object' ? product.farmer?._id : product.farmer;
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit,
      farmerId: farmerId || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ 
          id: editingProduct._id, 
          data: {
            name: formData.name,
            description: formData.description,
            category: formData.category as any,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            unit: formData.unit,
            farmer: formData.farmerId || undefined
          } 
        });
        toast({ title: "Updated", description: "Product updated successfully" });
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'farmerId') data.append('farmer', value);
          else data.append(key, value);
        });
        images.forEach((img) => data.append("images", img));
        await addProduct(data);
        toast({ title: "Success", description: "Product added successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Operation failed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast({ title: "Deleted", description: "Product removed successfully" });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to delete product",
          variant: "destructive",
        });
      }
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
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (KES)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit (e.g., kg, bunch, piece)</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="farmerId">Vendor/Farmer</Label>
                <Select
                  value={formData.farmerId}
                  onValueChange={(val) => setFormData({ ...formData, farmerId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => (
                      <SelectItem key={v.farmer._id} value={v.farmer._id}>
                        {v.farmer.name} ({v.farmName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              {!editingProduct && (
                <div className="grid gap-2">
                  <Label>Product Images</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImages([...images, ...files]);
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((file, i) => (
                      <div key={i} className="relative w-16 h-16 rounded border overflow-hidden">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                        <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-destructive text-white rounded-bl">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="submit" disabled={isAdding || isUpdating} className="w-full">
                  {(isAdding || isUpdating) ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {editingProduct ? "Save Changes" : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="shadow-card border-0 lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors ${!selectedCategory ? 'bg-muted' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="font-medium">All Products</span>
              </div>
              <Badge variant="secondary">{products.length}</Badge>
            </div>
            {categories.map((category) => (
              <div
                key={category.name}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors ${selectedCategory === category.name ? 'bg-muted' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${category.color}`} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge variant="secondary">
                  {products.filter(p => p.category === category.name).length}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="shadow-card border-0 hover-lift">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-xl bg-muted flex items-center justify-center mb-4 relative overflow-hidden">
                    {product.images?.length > 0 ? (
                      <img
                        src={`http://localhost:8000/${product.images[0].replace(/^\//, '')}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                      <Badge variant="secondary" className="text-[10px]">
                        {product.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      by {typeof product.farmer === 'object' ? product.farmer?.name : "Unknown"}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-bold text-emerald-600">KES {product.price}</p>
                      <Badge variant="outline" className={product.quantity < 20 ? "text-warning" : "text-success"}>
                        {product.quantity} {product.unit}
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(product)}>
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 px-2"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
