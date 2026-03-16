import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/admin/lib/api';

export interface Vendor {
  _id: string;
  farmer: {
    _id: string;
    name: string;
    email: string;
  };
  farmName: string;
  farmImage: string;
  businessName?: string;
  farmLocation: string;
  farmSize: string;
  categoriesDealtWith: string[];
  aboutFarm: string;
  createdAt: string;
  updatedAt: string;
}

export const useAdminVendors = () => {
  const queryClient = useQueryClient();

  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const res = await api.get('/farmers');
      return res.data as Vendor[];
    },
  });

  const addVendorMutation = useMutation({
    mutationFn: async (data: any) => {
      // Step 1: Register User as farmer
      const regRes = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password || 'Farmer@123',
        userType: 'farmer',
      });
      
      const farmerId = regRes.data.user.id;
      
      // Step 2: Create Farmer Profile
      const profileFormData = new FormData();
      profileFormData.append('farmerId', farmerId);
      profileFormData.append('farmName', data.farmName);
      profileFormData.append('farmLocation', data.farmLocation);
      profileFormData.append('farmSize', data.farmSize);
      profileFormData.append('aboutFarm', data.aboutFarm);
      profileFormData.append('businessName', data.businessName || '');
      
      if (data.categoriesDealtWith) {
        data.categoriesDealtWith.forEach((cat: string) => {
          profileFormData.append('categoriesDealtWith[]', cat);
        });
      }
      
      if (data.farmImage) {
        profileFormData.append('farmImage', data.farmImage);
      }
      
      await api.post('/farmers/profile', profileFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      return regRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
    },
  });

  return {
    vendors: vendors || [],
    isLoading,
    error,
    addVendor: addVendorMutation.mutateAsync,
    isAdding: addVendorMutation.isPending,
  };
};
