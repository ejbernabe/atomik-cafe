import { supabase } from '../lib/supabaseClient';
import type { DBTable } from '../types/custom';

export async function getHomeHeroes(): Promise<DBTable<'landing_page'>[]> {
  const { data, error } = await supabase
    .from('landing_page')
    .select('*')

  if (error) {
    throw error;
  }

  return (data as DBTable<'landing_page'>[]) || [];
}