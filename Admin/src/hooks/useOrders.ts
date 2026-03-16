import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Order {
    _id: string;
    consumer: {
        _id: string;
        name: string;
    };
    items: any[];
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    deliveryAddress: {
        city: string;
        county: string;
    };
    createdAt: string;
}

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/orders/status/${id}`, { status });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update order status');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, isLoading, error, refetch: fetchOrders, updateStatus };
}
