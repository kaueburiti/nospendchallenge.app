import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../lib/db/repository/product';
import { type Product } from '@/lib/db/models/Product';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

// -----------------------------------------------------------------------------
// Below are example CRUD implementations that you can use as an orientation, however we have not included them in the app to keep things simple

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateProduct(id, updates),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['product', data.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// -----------------------------------------------------------------------------