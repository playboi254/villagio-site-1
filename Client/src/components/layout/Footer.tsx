import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram,
  Twitter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import villagioLogo from '@/assets/villagio-logo.png';

// WhatsApp icon component
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/products', label: 'Shop All Products' },
    { href: '/vendors', label: 'Become a Vendor' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const categoryLinks = [
    { href: '/products?category=vegetables', label: 'Fresh Vegetables' },
    { href: '/products?category=fruits', label: 'Organic Fruits' },
    { href: '/products?category=dairy', label: 'Dairy & Eggs' },
    { href: '/products?category=herbs', label: 'Herbs & Spices' },
    { href: '/vendors', label: 'Farm Direct' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src={villagioLogo} 
                alt="Villagio" 
                className="h-14 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-primary-foreground/70 mb-6 text-sm">
              Fresh, organic produce delivered from local 
              Kenyan farms directly to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-orange hover:text-white transition-colors group"
              >
                <Facebook className="h-4 w-4 group-hover:text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-orange hover:text-white transition-colors group"
              >
                <Instagram className="h-4 w-4 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-orange hover:text-white transition-colors group"
              >
                <Twitter className="h-4 w-4 group-hover:text-white" />
              </a>
              <a 
                href="https://chat.whatsapp.com/LpNU6mugkJWLAV4rUPci82" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-orange hover:text-white transition-colors group"
              >
                <WhatsAppIcon className="h-4 w-4 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Nairobi, Kenya</span>
              </div>
              <a 
                href="tel:+254115566775" 
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-orange transition-colors"
              >
                <Phone className="h-4 w-4" />
                +254 115 566 775
              </a>
              <a 
                href="mailto:info@villagiofresh.co.ke" 
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-orange transition-colors"
              >
                <Mail className="h-4 w-4" />
                info@villagiofresh.co.ke
              </a>
            </div>
            
            {/* Newsletter */}
            <div>
              <p className="text-sm text-primary-foreground/70 mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-9 text-sm"
                />
                <Button size="sm" className="bg-secondary hover:bg-secondary-light text-secondary-foreground shrink-0">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-primary-foreground/60">
              © {currentYear} Villagio Farm Fresh. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-primary-foreground/60">
              <Link to="/privacy" className="hover:text-orange transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-orange transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-orange transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
