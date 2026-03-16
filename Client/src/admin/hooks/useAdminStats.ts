import { useQuery } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export const useAdminStats = () => {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard/admin');
      return res.data;
    },
    refetchInterval: 30000, // Refetch every 30s
  });

  const { data: categoryStats, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-category-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/category-stats');
      return res.data;
    }
  });

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: async () => {
      const res = await api.get('/dashboard/top-products');
      return res.data;
    }
  });

  return {
    dashboard,
    categoryStats,
    topProducts,
    isLoading: dashboardLoading || categoriesLoading || productsLoading,
  };
};
