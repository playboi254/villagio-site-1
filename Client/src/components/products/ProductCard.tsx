import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    unit?: string;
    farmer?: {
      name: string;
    };
    category: string;
    rating?: number;
    reviewCount?: number;
    stock: number;
    images: string[];
    tags?: string[];
  };
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/placeholder-product.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product as any);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/products/${product._id}`} className="group block">
        <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-accent text-accent-foreground">
                  -{discount}%
                </Badge>
              )}
              {product.category?.toLowerCase() === 'organic' && (
                <Badge variant="secondary" className="bg-leaf-light text-primary">
                  Organic
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <Button
                size="icon"
                variant="secondary"
                className={`h-8 w-8 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 ${
                  isWishlisted 
                    ? 'bg-red-500 hover:bg-red-600 border-red-500' 
                    : 'bg-card/90 hover:bg-card hover:border-orange'
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart 
                  className={`h-4 w-4 transition-colors ${
                    isWishlisted 
                      ? 'fill-white text-white' 
                      : 'text-muted-foreground hover:text-orange'
                  }`} 
                />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Vendor */}
            <p className="text-xs text-muted-foreground mb-1">{product.farmer?.name || 'Villagio'}</p>
            
            {/* Name */}
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 fill-orange text-orange" />
              <span className="text-sm font-medium">{product.rating || 5.0}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-lg font-bold text-foreground">
                KES {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  KES {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                /{product.unit || 'unit'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
