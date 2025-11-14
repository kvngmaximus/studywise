
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bdmrbzdboaybqdrprcjv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXJiemRib2F5YnFkcnByY2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzc3NTIsImV4cCI6MjA1NTY1Mzc1Mn0.4FOeM_PV_yu43Q0ym8kTV0tsH59oiGiGhWDzdq87BPI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
