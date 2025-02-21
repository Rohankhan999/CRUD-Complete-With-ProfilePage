const { createClient } = supabase;
const supabaseUrl = 'https://uudcdvucqfkwxeunrvye.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZGNkdnVjcWZrd3hldW5ydnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjg1MzcsImV4cCI6MjA1NTc0NDUzN30.jndNucd-l9kiHarhfQV66BLQdyi3XoENFM0WIj7iMOA"
export const supabaseConfig = createClient(supabaseUrl, supabaseKey);
