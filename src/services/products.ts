// src/services/productService.ts (or src/lib/products.ts)
import { supabase } from '../lib/supabaseClient';
import type { Product, DBTable } from '../data/database'; // Adjust path to your Product interface
 // Assuming you have a Database type defined in your database.ts
/**
 * Fetches all available products from the database
 */
export async function getAvailableProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('availability', true);

  if (error) {
    throw error;
  }

  return (data as Product[]) || [];
}

export async function getProductById(productId: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
  .single();  

  return error ? null : (data as Product | null);
}

export async function getCategories(): Promise<DBTable<'category'>[]> {

  const { data, error } = await supabase
    .from('category')
    .select('*')

  if (error) {
    throw error;
  }

  return (data as DBTable<'category'>[]) || [];
}