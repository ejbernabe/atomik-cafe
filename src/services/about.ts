import { supabase } from '../lib/supabaseClient';
import type { DBTable } from '../types/custom';

export async function getBranches(): Promise<DBTable<'branches'>[]> {
  const { data, error } = await supabase
    .from('branches')
    .select('*')

  if (error) {
    throw error;
  }

  return (data as DBTable<'branches'>[]) || [];
}