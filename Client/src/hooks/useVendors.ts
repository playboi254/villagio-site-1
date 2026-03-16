import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Vendor {
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
}

export const useVendors = () => {
  const { data: vendors = [], isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const [profilesRes, productsRes] = await Promise.all([
        api.get('/farmers'),
        api.get('/products')
      ]);

      const profiles = profilesRes.data;
      const products = productsRes.data;

      return profiles.map((p: any) => {
        const farmerProducts = products.filter((prod: any) => {
          const farmerId = prod.farmer?._id || prod.farmer;
          return farmerId === p.farmer?._id;
        });

        return {
          id: p.farmer?._id || p._id,
          name: p.farmName || p.farmer?.name || 'Villagio Farmer',
          slug: p.farmer?._id || p._id,
          description: p.aboutFarm || 'Quality local produce straight from the farm.',
          logo: p.farmImage ? `http://localhost:8000/${p.farmImage.replace(/^\//, '')}` : '/placeholder-vendor.jpg',
          coverImage: p.farmImage ? `http://localhost:8000/${p.farmImage.replace(/^\//, '')}` : '/images/hero-bg.jpg',
          rating: 4.8,
          reviewCount: 12,
          productCount: farmerProducts.length,
          location: p.farmLocation || 'Kenya',
          verified: true,
          categories: p.categoriesDealtWith ? p.categoriesDealtWith.split(',').map((c: string) => c.trim()) : ['Organic', 'Fresh']
        };
      });
    },
    refetchInterval: 10000,
  });

  return { 
    vendors, 
    isLoading, 
    error: error ? (error as any).message || 'Failed to fetch vendors' : null 
  };
};
