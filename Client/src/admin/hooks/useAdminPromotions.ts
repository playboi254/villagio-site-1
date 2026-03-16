import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export interface Promotion {
  _id: string;
  name: string;
  code: string;
  discount: string;
  type: 'percentage' | 'fixed' | 'shipping';
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usageCount: number;
  status: 'active' | 'expired' | 'scheduled';
  minOrder: number;
}

export const useAdminPromotions = () => {
  const queryClient = useQueryClient();

  const { data: promotions, isLoading } = useQuery({
    queryKey: ['admin-promotions'],
    queryFn: async () => {
      const res = await api.get('/promotions');
      return res.data as Promotion[];
    },
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/promotions', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
    },
  });

  const deletePromotionMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/promotions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] });
    },
  });

  return {
    promotions: promotions || [],
    isLoading,
    createPromotion: createPromotionMutation.mutateAsync,
    isCreating: createPromotionMutation.isPending,
    deletePromotion: deletePromotionMutation.mutateAsync,
    isDeleting: deletePromotionMutation.isPending,
  };
};
