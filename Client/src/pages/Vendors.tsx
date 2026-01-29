import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import VendorCard from '@/components/vendors/VendorCard';
import { vendors } from '@/data/mockData';

const Vendors: React.FC = () => {
  return (
    <MainLayout>
      <section className="bg-muted/50 py-12">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Our Farmers & Vendors</h1>
            <p className="text-muted-foreground">Meet the passionate people behind your food</p>
          </motion.div>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <VendorCard key={vendor.id} vendor={vendor} index={index} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Vendors;
