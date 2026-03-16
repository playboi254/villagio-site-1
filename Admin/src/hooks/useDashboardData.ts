import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface DashboardData {
    totalUsersByRole: Record<string, number>;
    totalFarmers: number;
    totalVendors: number;
    totalConsumers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: any[];
    monthlyTrend: any[];
    lowStockProducts: any[];
}

export function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/dashboard/admin');
            setData(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Optional: Polling
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    return { data, isLoading, error, refetch: fetchData };
}
