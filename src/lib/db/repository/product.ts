import { supabase } from '../../supabase';
import { type Category, type Product } from '../models/Product';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('data')
    .select(`
      *,
      data_categories (
        categories (name)
      )
    `)
    .order('created_at', { ascending: true });


  if (error) throw error;

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    src: item.src,
    description: item.description ?? '',
    href: item.href,
    featured: item.featured,
    categories: item.data_categories.map((dc) => dc?.categories?.name as Category),
    created_at: item.created_at ?? '',
    updated_at: item.updated_at ?? '',
  }));
};

// -----------------------------------------------------------------------------
// Below are example CRUD implementations that you can use as an orientation, however we have not included them in the app to keep things simple
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('data')
    .select(`
      *,
      data_categories (
        categories (name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    src: data.src,
    name: data.name,
    description: data.description ?? '',
    href: data.href,
    featured: data.featured,
    categories: data.data_categories.map((dc) => dc?.categories?.name as Category),
    created_at: data.created_at ?? '',
    updated_at: data.updated_at ?? '',
  };
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('data')
    .insert({
      name: product.name,
      description: product.description,
      href: product.href,
      featured: product.featured,
      src: "path/to/image.jpg" // example path to image in storage
    })
    .select()
    .single();

  if (error) throw error;

  await Promise.all(product.categories.map(async (category) => {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .single();

    if (categoryData) {
      await supabase.from('data_categories').insert({
        data_id: data.id,
        category_id: categoryData.id,
      });
    }
  }));

  return {
    ...data,
    description: data.description ?? '',
    created_at: data.created_at ?? '',
    updated_at: data.updated_at ?? '',
    categories: product.categories,
  };
};

export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product> => {
  const { data, error } = await supabase
    .from('data')
    .update({
      name: updates.name,
      description: updates.description,
      href: updates.href,
      featured: updates.featured,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (updates.categories) {
    await supabase.from('data_categories').delete().eq('data_id', id);
    await Promise.all(updates.categories.map(async (category) => {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();

      if (categoryData) {
        await supabase.from('data_categories').insert({
          data_id: id,
          category_id: categoryData.id,
        });
      }
    }));
  }

  return {
    ...data,
    categories: updates.categories ?? [],
  } as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('data')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
// -----------------------------------------------------------------------------