import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronRight,
  Store,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { useProduct } from '@/hooks/useProducts';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { product, relatedProducts, isLoading, error } = useProduct(id);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/placeholder-product.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <div className="animate-pulse text-muted-foreground">Loading product details...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">{error || 'Product not found'}</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addItem(product as any, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                <img
                  src={getImageUrl(product.images?.[selectedImage])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-lg px-3 py-1">
                    -{discount}%
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Vendor Link */}
              {product.farmer && (
                <div 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Store className="h-4 w-4" />
                  {product.farmer.name}
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
              )}

              {/* Title & Rating */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-orange text-orange" />
                    <span className="font-medium">{product.rating || 5.0}</span>
                    <span className="text-muted-foreground">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-primary' : 'text-destructive'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    KES {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-muted-foreground">/{product.unit || 'unit'}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary hover:bg-primary-dark"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-leaf-light mb-2">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Free Shipping<br/>Over KES 2,000</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-leaf-light mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Quality<br/>Guaranteed</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-leaf-light mb-2">
                    <RotateCcw className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Easy<br/>Returns</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Reviews ({product.reviewCount || 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none px-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <h4 className="font-display font-semibold text-foreground mt-6 mb-3">
                    Storage Instructions
                  </h4>
                  <p className="text-muted-foreground">
                    Store in a cool, dry place. Refrigerate after opening. 
                    Best consumed within 5 days of delivery for optimal freshness.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6 px-4">
                  {/* Review Summary Placeholder */}
                  <div className="flex items-center gap-6 p-6 bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">{product.rating || 5.0}</div>
                      <div className="flex items-center gap-1 justify-center my-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${(i < (product.rating || 5)) ? 'fill-orange text-orange' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.reviewCount || 0} reviews
                      </div>
                    </div>
                    <div className="flex-1">
                      <Button>Write a Review</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p._id} product={p as any} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ProductDetail;
