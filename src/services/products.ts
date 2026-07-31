// src/services/productService.ts (or src/lib/products.ts)
import { supabase } from '../lib/supabaseClient';
import type { Product, DBTable } from '../types/custom'; // Adjust path to your Product interface
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

export async function getSubCategories(): Promise<DBTable<'sub_category'>[]> {

  const { data, error } = await supabase
    .from('sub_category')
    .select('*')

  if (error) {
    throw error;
  }

  return (data as DBTable<'sub_category'>[]) || [];
}

export async function getOptionalAddons(productId: number) {
  // 1. Get the product's opt_addons array of IDs
  const { data: product, error: prodError } = await supabase
    .from('products')
    .select('opt_addons')
    .eq('id', productId)
    .single();

  if (prodError || !product?.opt_addons || product.opt_addons.length === 0) {
    return [];
  }

  // 2. Fetch the actual addons using the array of IDs
  const { data: addons, error: addonError } = await supabase
    .from('addons') // Replace with your actual addons table name if different
    .select('*')
    .in('id', product.opt_addons);

  if (addonError) {
    console.error('Error fetching optional addons:', addonError);
    return [];
  }

  return addons || [];
}

export async function getRequiredAddons(productId: number) {
  // 1. Get the product's req_addons (or whatever your required column is named) array of IDs
  const { data: product, error: prodError } = await supabase
    .from('products')
    .select('req_addons') // Change to your actual column name for required addons if it differs
    .eq('id', productId)
    .single();

  if (prodError || !product?.req_addons || product.req_addons.length === 0) {
    return [];
  }

  // 2. Fetch the actual addons using the array of IDs
  const { data: addons, error: addonError } = await supabase
    .from('addons')
    .select('*')
    .in('id', product.req_addons);

  if (addonError) {
    console.error('Error fetching required addons:', addonError);
    return [];
  }

  return addons || [];
}