import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  avatar?: string;
}

export const useAdminCustomers = () => {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data.users as Customer[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });

  return {
    customers: customers || [],
    isLoading,
    deleteCustomer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
