import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://niuhaltawhrehuwptiwd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdWhhbHRhd2hyZWh1d3B0aXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mjk0NTgsImV4cCI6MjA3OTQwNTQ1OH0.5nPziRWa9KajIcPvKfA--tPY9o06bHPcX7iBKNeySJE';

export const supabase = createClient(supabaseUrl, supabaseKey);
