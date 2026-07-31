import { supabase } from '../lib/supabaseClient';
import type { DBTable } from '../data/database';

export async function getPromos(): Promise<DBTable<'promos'>[]> {
  const { data, error } = await supabase
    .from('promos')
    .select('*')

  if (error) {
    throw error;
  }

  return (data as DBTable<'promos'>[]) || [];
}