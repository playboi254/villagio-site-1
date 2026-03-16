import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export const useAdminSettings = () => {
  const queryClient = useQueryClient();

  // Get current admin profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile');
      return res.data.user;
    },
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const res = await api.put('/auth/profile', data, config);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
