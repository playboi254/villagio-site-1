import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  MapPin,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import villagioLogo from '@/assets/villagio-logo.png';
import CarrotIcon from '@/components/icons/CarrotIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const categories = [
    { href: '/products?category=all', label: 'All Categories' },
    { href: '/products?category=vegetables', label: 'Vegetables' },
    { href: '/products?category=fruits', label: 'Fruits' },
    { href: '/products?category=dairy', label: 'Dairy & Eggs' },
    { href: '/products?category=herbs', label: 'Herbs & Spices' },
    { href: '/products?category=organic', label: 'Organic' },
    { href: '/vendors', label: 'Farm Direct' },
  ];

  const isActiveCategory = (href: string) => {
    if (href === '/vendors') {
      return location.pathname === '/vendors';
    }
    const params = new URLSearchParams(href.split('?')[1]);
    const category = params.get('category');
    const currentParams = new URLSearchParams(location.search);
    const currentCategory = currentParams.get('category');
    
    if (location.pathname === '/products') {
      if (category === 'all' && !currentCategory) return true;
      return category === currentCategory;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary" />
            <span>Delivering to: <strong>Nairobi, Kenya</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/order-tracking/check" className="hover:text-secondary transition-colors">Track Order</Link>
            <Link to="/help" className="hover:text-secondary transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-card border-b border-border">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img 
                src={villagioLogo} 
                alt="Villagio" 
                className="h-14 md:h-16 w-auto object-contain"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for fresh vegetables, fruits, dairy..."
                  className="pl-11 pr-4 h-11 bg-muted/50 border-border rounded-full focus:bg-card"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Toggle - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="hidden lg:inline">Wishlist</span>
                </Link>
              </Button>

              {/* Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span className="hidden lg:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card">
                    <div className="px-3 py-2">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile?tab=orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2" asChild>
                  <Link to="/login">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">Account</span>
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button variant="default" size="sm" className="bg-secondary hover:bg-secondary-light text-secondary-foreground gap-2" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:inline">Cart</span>
                  {itemCount > 0 && (
                    <Badge className="bg-card text-foreground h-5 min-w-5 p-0 flex items-center justify-center text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden mt-3 overflow-hidden"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-11 pr-4 h-11 bg-muted/50 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Navigation */}
        <nav className="hidden md:block border-t border-border/50">
          <div className="container">
            <ul className="flex items-center gap-1 overflow-x-auto">
              {categories.map((cat) => {
                const isActive = isActiveCategory(cat.href);
                return (
                  <li key={cat.href} className="relative">
                    <Link
                      to={cat.href}
                      className={`
                        block px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap relative
                        ${isActive 
                          ? 'text-orange' 
                          : cat.label === 'All Categories' 
                            ? 'text-foreground hover:text-orange' 
                            : 'text-muted-foreground hover:text-orange'
                        }
                      `}
                    >
                      {cat.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5">
                          <CarrotIcon className="w-5 h-5 text-orange" />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg"
          >
            <nav className="container py-4">
              <ul className="space-y-1">
                {categories.map((cat) => {
                  const isActive = isActiveCategory(cat.href);
                  return (
                    <li key={cat.href}>
                      <Link
                        to={cat.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 ${isActive ? 'text-orange bg-orange/10' : ''}`}
                      >
                        {cat.label}
                        {isActive && <CarrotIcon className="w-4 h-4 text-orange" />}
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-muted"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-muted"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 px-4">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="flex-1 bg-secondary hover:bg-secondary-light" asChild>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
