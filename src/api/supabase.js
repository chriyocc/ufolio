import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://dmiwanmucdhsysxlyfgl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaXdhbm11Y2Roc3lzeGx5ZmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzI4NTgsImV4cCI6MjA3Mzg0ODg1OH0.0jrTWTXdoJ4W_exlbXhbLsHoDlUj8ZFiMQDtzx0OEMw')

export default supabase;