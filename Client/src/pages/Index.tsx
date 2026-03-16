import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Truck, 
  Shield, 
  Star,
  ChevronRight,
  Headphones,
  MapPin,
  Leaf,
  Users,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/categories/CategoryCard';
import { useProducts } from '@/hooks/useProducts';
import { useVendors } from '@/hooks/useVendors';
import { usePromotions } from '@/hooks/usePromotions';
import { categories as mockCategories } from '@/data/mockData';

// Hero images
import heroSlide1 from '@/assets/hero-slide1.jpg';
import heroSlide2 from '@/assets/Slider/UKM.jpg';
import heroSlide3 from '@/assets/Slider/Category Cereals.jpg';
import heroSlide4 from '@/assets/Slider/1000024088.jpg';

const heroImages = [heroSlide1, heroSlide2, heroSlide3, heroSlide4];

const Index: React.FC = () => {
  const { products: productsData, isLoading } = useProducts();
  const { vendors: vendorsData, isLoading: isVendorsLoading } = useVendors();
  const { data: promotions } = usePromotions();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter top vendors for display
  const topVendors = vendorsData.slice(0, 4);

  // Dynamically calculate category counts and combine with mock data for images
  const liveCategories = useMemo(() => {
    return mockCategories.map(cat => {
      const count = productsData.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase()).length;
      return { ...cat, productCount: count || cat.productCount };
    });
  }, [productsData]);

  const features = [
    {
      icon: Truck,
      title: 'Same Day Delivery',
      description: 'Fresh products delivered within hours',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: '100% fresh and organic certified',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help you',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative" style={{ backgroundColor: 'hsl(152, 45%, 16%)' }}>
        <div className="container py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4 px-3 py-1">
                <Leaf className="h-3 w-3 mr-1" />
                Fresh from Farm to Your Home
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-primary-foreground mb-6 leading-tight">
                Fresh, Organic<br />
                Produce Delivered to<br />
                Your Doorstep
              </h1>
              
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
                Shop from local Kenyan farms and get fresh vegetables, fruits, dairy, and 
                more delivered same day. Support local farmers while enjoying the freshest 
                produce.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <Button size="lg" className="bg-secondary hover:bg-secondary-light text-secondary-foreground gap-2" asChild>
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="backdrop-blur-md bg-white/10 border-white/30 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-300" asChild>
                  <Link to="/vendors">
                    Browse Vendors
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 lg:gap-8">
                <div>
                  <div className="text-3xl font-bold text-secondary">{productsData.length > 50 ? productsData.length : '50+'}</div>
                  <div className="text-sm text-primary-foreground/70">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">{vendorsData.length}</div>
                  <div className="text-sm text-primary-foreground/70">Vendors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">10K+</div>
                  <div className="text-sm text-primary-foreground/70">Happy Customers</div>
                </div>
                <div className="bg-card text-foreground px-4 py-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Special Offer</div>
                  <div className="text-lg font-bold text-primary">20% OFF</div>
                  <div className="text-xs text-muted-foreground">First Order</div>
                </div>
              </div>
            </motion.div>

            {/* Right Image Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={heroImages[currentSlide]}
                    alt="Fresh organic produce"
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-secondary w-6' 
                          : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 border-y border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Shop by Category
              </h2>
              <p className="text-muted-foreground">
                Browse our wide selection of fresh produce
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-secondary hover:text-secondary-light" asChild>
              <Link to="/products">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {liveCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Fresh picks just for you
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-secondary hover:text-secondary-light" asChild>
              <Link to="/products">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl aspect-square animate-pulse" />
              ))
            ) : (
              productsData
                .filter(p => p.featured)
                .slice(0, 8)
                .map((product, index) => (
                  <ProductCard key={product._id} product={product as any} index={index} />
                ))
            )}
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Button className="bg-secondary hover:bg-secondary-light" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-8">
        <div className="container">
          {promotions?.filter(p => p.status === 'active').slice(0,1).map(promo => (
            <motion.div
              key={promo._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-2">
                  Special Offer: {promo.name}!
                </h2>
                <p className="text-secondary-foreground/90 mb-2">
                  Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">{promo.code}</span> at checkout
                </p>
                <p className="text-sm text-secondary-foreground/70">
                  {promo.type === 'percentage' ? `${promo.discount}% OFF` : promo.type === 'fixed' ? `KES ${promo.discount} OFF` : 'Free Shipping'} on orders above KES {promo.minOrder.toLocaleString()}
                </p>
              </div>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-light shrink-0" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
            </motion.div>
          ))}
          {(!promotions || promotions.filter(p => p.status === 'active').length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-2xl font-bold text-primary mb-2">Welcome to Villagio Farm Fresh!</h2>
              <p className="text-muted-foreground mb-6">Quality organic products from local Kenyan farms.</p>
              <Button size="lg" className="bg-primary hover:bg-primary-light" asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Top Vendors */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Top Rated Vendors
              </h2>
              <p className="text-muted-foreground">
                Shop from the best local farms
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex text-secondary hover:text-secondary-light" asChild>
              <Link to="/vendors">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/vendors/${vendor.slug}`} className="block group">
                  <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-md transition-all">
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={vendor.coverImage} 
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {vendor.verified && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                          Top Rated
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-orange text-orange" />
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{vendor.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{vendor.productCount}</span>
                          <span className="text-muted-foreground ml-1">Products</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Delivery:</span>
                          <span className="font-medium text-primary ml-1">Same Day</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Visit Store
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply to Become a Vendor Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 md:p-12 shadow-card"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Store className="h-6 w-6 text-secondary" />
                  </div>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    For Farmers & Vendors
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Join Our Growing Network
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join our growing network of local farmers and vendors. Reach thousands of customers 
                  across Kenya, get same-day delivery support, and grow your business with Villagio.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Access to 10,000+ active customers
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Integrated delivery and logistics support
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Easy-to-use vendor dashboard
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Competitive commission rates
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-secondary hover:bg-secondary-light text-secondary-foreground gap-2" asChild>
                    <Link to="/vendor-application">
                      Apply to be Vendor
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2" asChild>
                    <Link to="/vendor-application?type=farmer">
                      Apply to be Farmer
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-xl p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">87+</div>
                    <div className="text-sm text-muted-foreground">Active Vendors</div>
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-6 text-center">
                    <Store className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">500+</div>
                    <div className="text-sm text-muted-foreground">Products Listed</div>
                  </div>
                  <div className="bg-orange/10 rounded-xl p-6 text-center col-span-2">
                    <Star className="h-8 w-8 text-orange mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">4.8/5</div>
                    <div className="text-sm text-muted-foreground">Average Vendor Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Stay Fresh with Our Newsletter
            </h2>
            <p className="text-muted-foreground mb-6">
              Get weekly updates on new products, special offers, and farming tips
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-12 rounded-full px-5"
              />
              <Button size="lg" className="bg-secondary hover:bg-secondary-light rounded-full px-8">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;






