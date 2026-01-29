import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Vegetables", count: 156, color: "bg-success" },
  { name: "Fruits", count: 98, color: "bg-accent" },
  { name: "Dairy", count: 45, color: "bg-info" },
  { name: "Grains", count: 67, color: "bg-warning" },
  { name: "Poultry", count: 34, color: "bg-primary" },
  { name: "Organic", count: 89, color: "bg-success" },
];

const products = [
  { id: 1, name: "Fresh Sukuma Wiki", category: "Vegetables", price: 50, stock: 245, vendor: "Green Valley Farms", featured: true },
  { id: 2, name: "Organic Tomatoes", category: "Vegetables", price: 120, stock: 180, vendor: "Organic Roots", featured: true },
  { id: 3, name: "Farm Fresh Eggs", category: "Poultry", price: 450, stock: 89, vendor: "Farm Fresh Poultry", featured: false },
  { id: 4, name: "Fresh Milk (1L)", category: "Dairy", price: 65, stock: 320, vendor: "Sunrise Dairy", featured: true },
  { id: 5, name: "Sweet Mangoes", category: "Fruits", price: 80, stock: 156, vendor: "Fresh Harvest Co.", featured: false },
  { id: 6, name: "Brown Rice (1kg)", category: "Grains", price: 180, stock: 98, vendor: "Highland Grains", featured: false },
  { id: 7, name: "Fresh Spinach", category: "Vegetables", price: 60, stock: 0, vendor: "Green Valley Farms", featured: false },
  { id: 8, name: "Organic Carrots", category: "Organic", price: 100, stock: 134, vendor: "Organic Roots", featured: true },
];

export default function Products() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <Card className="shadow-card border-0 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${category.color}`} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge variant="secondary">{category.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>

          {/* Products */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="shadow-card border-0 hover-lift">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-xl bg-muted flex items-center justify-center mb-4 relative overflow-hidden">
                    <Package className="h-16 w-16 text-muted-foreground/50" />
                    {product.featured && (
                      <Badge className="absolute top-2 right-2 bg-accent">Featured</Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">{product.vendor}</p>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-bold text-accent">KES {product.price}</p>
                      <Badge
                        variant="outline"
                        className={
                          product.stock === 0
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : product.stock < 100
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-success/10 text-success border-success/20"
                        }
                      >
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
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
