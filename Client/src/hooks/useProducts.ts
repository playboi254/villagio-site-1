import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    unit?: string;
    stock: number;
    images: string[];
    farmer: {
        _id: string;
        name: string;
    };
    featured: boolean;
    rating?: number;
    reviewCount?: number;
}

export function useProducts() {
    const { data: products = [], isLoading, error, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/products');
            return response.data;
        },
        refetchInterval: 10000, // Poll every 10s for sync
    });

    return { 
        products, 
        isLoading, 
        error: error ? (error as any).response?.data?.message || 'Failed to fetch products' : null, 
        refetch 
    };
}

export function useProduct(id: string | undefined) {
    const { data: product = null, isLoading: isProductLoading, error: productError } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/products/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const { data: relatedProducts = [], isLoading: isRelatedLoading } = useQuery({
        queryKey: ['products', 'related', product?.category],
        queryFn: async () => {
            if (!product?.category) return [];
            const response = await api.get(`/products?category=${product.category}`);
            return response.data.filter((p: Product) => p._id !== id).slice(0, 4);
        },
        enabled: !!product?.category,
    });

    return { 
        product, 
        relatedProducts, 
        isLoading: isProductLoading || isRelatedLoading, 
        error: productError ? (productError as any).response?.data?.message || 'Failed to fetch product details' : null 
    };
}

export function useSearchProducts(params: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
}) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['products', 'search', params],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            if (params.category && params.category !== 'all') queryParams.append('category', params.category);
            if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());

            const response = await api.get(`/products/search?${queryParams.toString()}`);
            return response.data;
        },
        enabled: true,
    });

    return { 
        results: data?.results || [], 
        pagination: data?.pagination || null,
        isLoading, 
        error: error ? (error as any).response?.data?.message || 'Search failed' : null, 
        refetch 
    };
}
