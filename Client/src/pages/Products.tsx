import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Filter, 
  Grid3X3, 
  List,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Products: React.FC = () => {
  const { products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  
  const selectedCategory = searchParams.get('category') || '';
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const searchQuery = searchParams.get('search') || '';

  // Dynamically generate categories from products
  const dynamicCategories = useMemo(() => {
    const cats: Record<string, number> = {};
    products.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    return Object.entries(cats).map(([name, count]) => ({
      name,
      slug: name,
      productCount: count
    }));
  }, [products]);

  // Dynamically generate vendors (farmers) from products
  const dynamicVendors = useMemo(() => {
    const vendorsSet = new Set<string>();
    products.forEach(p => {
      if (p.farmer?.name) vendorsSet.add(p.farmer.name);
    });
    return Array.from(vendorsSet).map(name => ({ id: name, name }));
  }, [products]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Category filter: case-insensitive
    if (selectedCategory && selectedCategory !== 'all') {
      const catMatch = product.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!catMatch) return false;
    }
    
    // Vendor filter
    if (selectedVendors.length > 0) {
      const vendorName = product.farmer?.name;
      if (!vendorName || !selectedVendors.includes(vendorName)) return false;
    }

    // Search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchParams({});
    setSelectedVendors([]);
  };

  const toggleVendor = (name: string) => {
    setSelectedVendors(prev => 
      prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-muted-foreground">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          Loading products...
        </div>
      </MainLayout>
    );
  }

  const FilterSection = () => (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['categories', 'vendors', 'price']}>
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="font-display font-semibold">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={!selectedCategory || selectedCategory === 'all'}
                  onCheckedChange={() => setSearchParams({})}
                />
                <span className="text-sm">All Categories</span>
              </label>
              {dynamicCategories.map((category) => (
                <label
                  key={category.slug}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategory.toLowerCase() === category.slug.toLowerCase()}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSearchParams({ ...Object.fromEntries(searchParams), category: category.slug });
                      } else {
                        const params = Object.fromEntries(searchParams);
                        delete params.category;
                        setSearchParams(params);
                      }
                    }}
                  />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    ({category.productCount})
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Vendors */}
        <AccordionItem value="vendors">
          <AccordionTrigger className="font-display font-semibold">
            Vendors
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {dynamicVendors.map((vendor) => (
                <label
                  key={vendor.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox 
                    checked={selectedVendors.includes(vendor.name)}
                    onCheckedChange={() => toggleVendor(vendor.name)}
                  />
                  <span className="text-sm">{vendor.name}</span>
                </label>
              ))}
              {dynamicVendors.length === 0 && <p className="text-xs text-muted-foreground">No vendors found</p>}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="font-display font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input placeholder="Min" type="number" className="h-9" />
                <span className="text-muted-foreground self-center">-</span>
                <Input placeholder="Max" type="number" className="h-9" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear Filters */}
      {(selectedCategory || searchQuery || selectedVendors.length > 0) && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-muted/50 py-12">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {selectedCategory || 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} products available
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4">
          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <FilterSection />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSection />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Active Filters */}
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedCategory}
                      <button
                        onClick={() => {
                          const params = Object.fromEntries(searchParams);
                          delete params.category;
                          setSearchParams(params);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-card">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <div className={`grid gap-4 md:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {sortedProducts.map((product, index) => (
                    <ProductCard key={product._id} product={product as any} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🥬</div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}

              {/* Pagination Placeholder */}
              {sortedProducts.length > 0 && (
                <div className="flex justify-center gap-2 mt-12">
                   {/* Simplified pagination for now */}
                   <Button variant="outline" disabled>1</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Products;
