import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";

export default function Products() {
  const { products, isLoading, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category))).map(cat => ({
    name: cat,
    count: products.filter(p => p.category === cat).length,
    color: "bg-accent"
  }));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading products...</div>
    );
  }

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
            <div
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${!selectedCategory ? 'bg-accent/10 border border-accent/20' : 'hover:bg-muted'}`}
            >
              <span className="font-medium">All Categories</span>
              <Badge variant="secondary">{products.length}</Badge>
            </div>
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedCategory === category.name ? 'bg-accent/10 border border-accent/20' : 'hover:bg-muted'}`}
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
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Products */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No products found matching your criteria.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product._id} className="shadow-card border-0 hover-lift">
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-xl bg-muted flex items-center justify-center mb-4 relative overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-16 w-16 text-muted-foreground/50" />
                      )}
                      {product.featured && (
                        <Badge className="absolute top-2 right-2 bg-accent">Featured</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground truncate mr-2" title={product.name}>{product.name}</h3>
                        <Badge variant="secondary" className="text-xs shrink-0">{product.category}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground truncate">{product.farmer?.name || 'Villagio'}</p>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-lg font-bold text-accent">KES {product.price}</p>
                        <Badge
                          variant="outline"
                          className={
                            product.stock === 0
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : product.stock < 10
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
