import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface Promotion {
  _id: string;
  name: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'shipping';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'scheduled';
  usageLimit?: number;
  usageCount: number;
  minOrder: number;
}

export const usePromotions = () => {
  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/promotions`);
      return res.data.data.promotions || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
