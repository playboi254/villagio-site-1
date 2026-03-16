import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Transaction {
    _id: string;
    consumer: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: number;
    updatedAt: string;
}

export function usePayments() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/payments');
            setTransactions(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch payments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return { transactions, isLoading, error, refetch: fetchPayments };
}
