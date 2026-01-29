import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  Truck, 
  ShieldCheck,
  ArrowLeft,
  Grid,
  List,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { vendors, products } from '@/data/mockData';

const VendorDetail: React.FC = () => {
  const { slug } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const vendor = vendors.find(v => v.slug === slug) || vendors[0];
  const vendorProducts = products.filter(p => p.vendorId === vendor.id);

  return (
    <MainLayout>
      {/* Vendor Header */}
      <section className="relative">
        <div className="h-48 md:h-64 overflow-hidden">
          <img 
            src={vendor.coverImage} 
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        </div>
        
        <div className="container relative -mt-20">
          <Link 
            to="/vendors" 
            className="inline-flex items-center gap-2 text-background/80 hover:text-background mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vendors
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Vendor Logo */}
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-4 border-card shadow-md">
                <img 
                  src={vendor.logo} 
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Vendor Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-display text-2xl md:text-3xl font-bold">{vendor.name}</h1>
                      {vendor.verified && (
                        <Badge className="bg-primary/10 text-primary">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{vendor.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Since {vendor.established}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mt-3 max-w-2xl">{vendor.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-orange text-orange" />
                      <span className="text-xl font-bold">{vendor.rating}</span>
                      <span className="text-muted-foreground">({vendor.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-primary">{vendor.productCount}</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{vendor.reviewCount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                      <Truck className="h-5 w-5" />
                      Same Day
                    </div>
                    <div className="text-sm text-muted-foreground">Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products ({vendorProducts.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="text-muted-foreground">
                  Showing {vendorProducts.length} products
                </p>
                
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border rounded-lg">
                    <Button 
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {vendorProducts.length > 0 ? (
                <div className={`grid gap-4 md:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 lg:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {vendorProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products available from this vendor</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Customer Reviews</h3>
                <p className="text-muted-foreground mb-4">Reviews from customers who purchased from {vendor.name}</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(vendor.rating) ? 'fill-orange text-orange' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-bold">{vendor.rating}</span>
                  <span className="text-muted-foreground">({vendor.reviewCount} reviews)</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold mb-3">About {vendor.name}</h3>
                  <p className="text-muted-foreground">{vendor.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {vendor.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="capitalize">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-muted-foreground">{vendor.location}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Established</h4>
                  <p className="text-muted-foreground">{vendor.established}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default VendorDetail;
