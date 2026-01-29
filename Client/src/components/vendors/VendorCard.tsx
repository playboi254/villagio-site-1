import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, BadgeCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo: string;
    coverImage: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    location: string;
    verified: boolean;
    categories: string[];
  };
  index?: number;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/vendors/${vendor.slug}`} className="group block">
        <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
          {/* Cover Image */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={vendor.coverImage}
              alt={vendor.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
            
            {/* Logo */}
            <div className="absolute -bottom-8 left-4">
              <div className="w-16 h-16 rounded-xl bg-card shadow-lg overflow-hidden border-4 border-card">
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-10 p-4 pb-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {vendor.name}
                  </h3>
                  {vendor.verified && (
                    <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {vendor.location}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {vendor.description}
            </p>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-3">
              {vendor.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs capitalize">
                  {cat}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-orange text-orange" />
                <span className="text-sm font-medium">{vendor.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({vendor.reviewCount})
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {vendor.productCount} products
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VendorCard;
