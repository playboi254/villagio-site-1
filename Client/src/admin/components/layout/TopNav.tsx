import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Store, Package, Users,
  BarChart3, Truck, CreditCard, Tag, Settings, Search,
  Bell, Menu, X, Carrot, LogOut,
} from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { Badge } from "@/admin/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/admin/components/ui/dropdown-menu";
import useAdminAuth from "@/admin/context/useAdminAuth";

// ✅ FIX: all paths now prefixed with /admin
const navItems = [
  { label: "Dashboard",  path: "/admin",            icon: LayoutDashboard },
  { label: "Orders",     path: "/admin/orders",     icon: ShoppingCart },
  { label: "Vendors",    path: "/admin/vendors",    icon: Store },
  { label: "Products",   path: "/admin/products",   icon: Package },
  { label: "Customers",  path: "/admin/customers",  icon: Users },
  { label: "Analytics",  path: "/admin/analytics",  icon: BarChart3 },
  { label: "Delivery",   path: "/admin/delivery",   icon: Truck },
  { label: "Payments",   path: "/admin/payments",   icon: CreditCard },
  { label: "Promotions", path: "/admin/promotions", icon: Tag },
  { label: "Settings",   path: "/admin/settings",   icon: Settings },
];

export function TopNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { admin, logout } = useAdminAuth();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between gap-4">

          {/* ✅ FIX: Logo now links to /admin not / */}
          <Link to="/admin" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold tracking-tight">V</span>
              <Carrot className="h-5 w-5 text-accent -rotate-45" />
              <span className="text-xl font-bold tracking-tight">llag</span>
              <Carrot className="h-5 w-5 text-accent -rotate-45" />
              <span className="text-xl font-bold tracking-tight">o</span>
            </div>
            <span className="hidden sm:inline text-sm font-medium opacity-80">Admin</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
              <Input
                placeholder="Search orders, products, vendors..."
                className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary-foreground/10">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      {admin?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-medium">
                    {admin?.name || 'Admin'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{admin?.email || 'Admin'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* ✅ FIX: logout now wired to actual logout function */}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-card border-b shadow-soft">
        <div className="container">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              // ✅ FIX: active check now matches /admin prefixed paths
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin' || location.pathname === '/admin/'
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1 animate-slide-up">
              <div className="px-2 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>
              {navItems.map((item) => {
                const isActive =
                  item.path === '/admin'
                    ? location.pathname === '/admin' || location.pathname === '/admin/'
                    : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}