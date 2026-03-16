import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    farmer: {
        _id: string;
        name: string;
    };
    featured: boolean;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/products');
            setProducts(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete product');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, isLoading, error, refetch: fetchProducts, deleteProduct };
}
