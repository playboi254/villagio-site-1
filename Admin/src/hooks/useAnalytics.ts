import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function useAnalytics() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            const [dashboardRes, categoryRes, productsRes] = await Promise.all([
                api.get('/dashboard/admin'),
                api.get('/dashboard/category-stats'),
                api.get('/dashboard/top-products')
            ]);

            setData({
                ...dashboardRes.data,
                categoryStats: categoryRes.data,
                topProducts: productsRes.data
            });
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch analytics');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { data, isLoading, error, refetch: fetchAnalytics };
}
