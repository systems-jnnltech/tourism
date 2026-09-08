import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  TouristArrival,
  TourismEstablishment,
  MSMETourism,
  TourismDestination,
  TourismEvent,
  NoticeOfViolation,
  TouristComplaint,
  TouristFeedback,
  OfficialDocument,
  AuditLogEntry,
  EmployeeRecord,
  OfficeInventoryItem,
  UserProfile,
  MarketingCampaign,
  VisitorAssistanceLog,
  LostAndFoundItem,
  FinancialMonitoringRecord,
  TourismPolicy,
  TourismProduct,
  TourismResearch,
  ScheduledPost,
} from '../types';

// Utility to convert camelCase object keys to snake_case for PostgreSQL
export function toSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = value;
    }
  }
  return result;
}

// Utility to convert snake_case database row keys to camelCase for TypeScript
export function toCamelCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      const camelKey = key.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = value;
    }
  }
  return result;
}

// Health check to verify live connectivity with Supabase
export async function checkSupabaseHealth(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('tourist_destinations').select('id', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

// Generic Supabase Helpers
export async function fetchTableData<T>(tableName: string): Promise<T[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    let query = supabase.from(tableName).select('*');
    if (tableName === 'audit_logs') {
      query = query.order('timestamp', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    const { data, error } = await query;
    if (error) {
      // Fallback without ordering if order column doesn't match
      const { data: fallbackData, error: fallbackErr } = await supabase.from(tableName).select('*');
      if (fallbackErr) {
        console.warn(`[Supabase Sync] Error fetching from ${tableName}:`, fallbackErr.message);
        return null;
      }
      return (fallbackData || []).map((row) => toCamelCase(row) as T);
    }
    return (data || []).map((row) => toCamelCase(row) as T);
  } catch (err) {
    console.warn(`[Supabase Sync] Exception fetching ${tableName}:`, err);
    return null;
  }
}

export async function insertTableRow(tableName: string, dataObj: Record<string, any>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const snakeRow = toSnakeCase(dataObj);
    const { error } = await supabase.from(tableName).insert([snakeRow]);
    if (error) {
      console.error(`[Supabase Sync] Insert error on ${tableName}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Supabase Sync] Insert exception on ${tableName}:`, err);
    return false;
  }
}

export async function updateTableRow(tableName: string, id: string, updatedObj: Record<string, any>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const snakeRow = toSnakeCase(updatedObj);
    delete snakeRow.id; // Don't overwrite primary key
    const { error } = await supabase.from(tableName).update(snakeRow).eq('id', id);
    if (error) {
      console.error(`[Supabase Sync] Update error on ${tableName} (${id}):`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Supabase Sync] Update exception on ${tableName}:`, err);
    return false;
  }
}

export async function deleteTableRow(tableName: string, id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      console.error(`[Supabase Sync] Delete error on ${tableName} (${id}):`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[Supabase Sync] Delete exception on ${tableName}:`, err);
    return false;
  }
}

// Populate Supabase if empty with initial seed dataset
export async function seedTableIfEmpty(tableName: string, seedArray: any[]): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !seedArray.length) return false;
  try {
    const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
    if (error) {
      console.warn(`[Supabase Sync] Count check failed for ${tableName}:`, error.message);
      return false;
    }
    if (count === 0) {
      const snakeRows = seedArray.map((item) => toSnakeCase(item));
      const { error: insertErr } = await supabase.from(tableName).insert(snakeRows);
      if (!insertErr) {
        console.log(`[Supabase Sync] Successfully seeded ${seedArray.length} records into ${tableName}`);
        return true;
      } else {
        console.warn(`[Supabase Sync] Seeding insert failed for ${tableName}:`, insertErr.message);
      }
    }
    return false;
  } catch (err) {
    console.warn(`[Supabase Sync] Seeding exception on ${tableName}:`, err);
    return false;
  }
}
