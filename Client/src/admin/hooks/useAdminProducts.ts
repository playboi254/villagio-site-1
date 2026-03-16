import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy and Eggs' | 'Herbs and Spices' | 'Grains and Cereals';
  price: number;
  quantity: number;
  unit: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  } | string;
  images: string[];
  isAvailable: boolean;
  location?: {
    county: string;
    area: string;
    estate: string;
  };
}

export const useAdminProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data as Product[];
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  return {
    products: products || [],
    isLoading,
    error,
    addProduct: addProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isAdding: addProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};
