import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export interface Order {
  _id: string;
  consumer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  vendorFirstName: string;
  vendorLastName: string;
  deliveryAddress: {
    phone: string;
    streetAddress: string;
    city: string;
    county: string;
    postalCode: string;
  };
  paymentMethod: 'mpesa' | 'credit' | 'debit' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export const useAdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data as Order[];
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/orders', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  return {
    orders: orders || [],
    isLoading,
    error,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    isUpdating: updateOrderStatusMutation.isPending,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
  };
};
