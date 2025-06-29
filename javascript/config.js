const { createClient } = supabase;
const supabaseUrl = 'https://lzkoppnhqvujiocbltxh.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a29wcG5ocXZ1amlvY2JsdHhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNjY4NTUsImV4cCI6MjA1Mjg0Mjg1NX0.j7FXxxxZ-GE9PFxhWa2Gq-OyiUcsrLN4oRT4Gg9ZXHI"
export const supabaseConfig = createClient(supabaseUrl, supabaseKey);
