import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import VendorCard from '@/components/vendors/VendorCard';
import { useVendors } from '@/hooks/useVendors';
import { Loader2 } from 'lucide-react';

const Vendors: React.FC = () => {
  const { vendors, isLoading, error } = useVendors();

  return (
    <MainLayout>
      <section className="bg-muted/50 py-12">
        <div className="container px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Our Farmers & Vendors</h1>
            <p className="text-muted-foreground">Meet the passionate people behind your food</p>
          </motion.div>
        </div>
      </section>
      <section className="py-12">
        <div className="container px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-muted-foreground">Finding our amazing farmers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">{error}</div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No vendors found yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor, index) => (
                <VendorCard key={vendor.id} vendor={vendor} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Vendors;
