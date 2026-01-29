import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    productCount: number;
  };
  index?: number;
  variant?: 'default' | 'large';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  index = 0, 
  variant = 'default' 
}) => {
  const isLarge = variant === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link 
        to={`/products?category=${category.slug}`}
        className="group block relative overflow-hidden rounded-2xl"
      >
        <div className={`relative ${isLarge ? 'aspect-[4/3]' : 'aspect-square'}`}>
          {/* Background Image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className={`font-display font-bold text-background mb-1 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                {category.name}
              </h3>
              <p className="text-background/80 text-sm mb-3 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-background/70">
                  {category.productCount} products
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-background group-hover:text-primary transition-colors">
                  Shop Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
