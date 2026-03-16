import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    userType: string;
    avatar?: string;
    address?: {
        village?: string;
        county?: string;
        city?: string;
    };
    createdAt: string;
}

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/users');
            // Filter only customers (consumers) if needed, or show all
            setCustomers(response.data.filter((u: any) => u.userType === 'consumer' || u.userType === 'user'));
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch customers');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            if (!window.confirm('Are you sure you want to delete this customer?')) return;
            await api.delete(`/users/${id}`);
            setCustomers(prev => prev.filter(c => c._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete customer');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return { customers, isLoading, error, refetch: fetchCustomers, deleteCustomer };
}
