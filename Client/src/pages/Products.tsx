import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown,
  X
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
import { products, categories, vendors } from '@/data/mockData';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  
  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
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
        return b.rating - a.rating;
      case 'newest':
        return 0; // Would use createdAt in real implementation
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchParams({});
  };

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
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategory === category.slug}
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
              {vendors.map((vendor) => (
                <label
                  key={vendor.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox />
                  <span className="text-sm">{vendor.name}</span>
                </label>
              ))}
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
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  Under KES 100
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  KES 100 - 500
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  KES 500 - 1,000
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  KES 1,000+
                </Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger className="font-display font-semibold">
            Tags
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-leaf-light hover:text-primary hover:border-primary">
                Organic
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-leaf-light hover:text-primary hover:border-primary">
                Local
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-leaf-light hover:text-primary hover:border-primary">
                Seasonal
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-leaf-light hover:text-primary hover:border-primary">
                Fresh
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-leaf-light hover:text-primary hover:border-primary">
                Free-Range
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-leaf-light hover:text-primary hover:border-primary">
                Grass-Fed
              </Badge>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear Filters */}
      {(selectedCategory || searchQuery) && (
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
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {selectedCategory 
                ? categories.find(c => c.slug === selectedCategory)?.name || 'Products'
                : 'All Products'
              }
            </h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} products available
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
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
                      {categories.find(c => c.slug === selectedCategory)?.name}
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
                    <ProductCard key={product.id} product={product} index={index} />
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

              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">
                    Next
                  </Button>
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
