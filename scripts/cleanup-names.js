const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
// Using ANON KEY - This might fail if RLS policies block updates
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cleanupNames() {
    console.log('Starting name cleanup...');

    // 1. Fetch characters with HTML tags in their name
    // We look for names containing '<'
    const { data: chars, error } = await supabase
        .from('characters')
        .select('id, name')
        .ilike('name', '%<%')
        .limit(1000);

    if (error) {
        console.error('Fetch error:', error);
        return;
    }

    console.log(`Found ${chars.length} characters with potentially dirty names.`);

    let updateCount = 0;

    for (const char of chars) {
        const originalName = char.name;
        // Regex to strip tags
        const cleanName = originalName.replace(/<\/?[^>]+(>|$)/g, "");

        if (originalName !== cleanName) {
            console.log(`Updating: ${originalName} -> ${cleanName}`);

            const { error: updateError } = await supabase
                .from('characters')
                .update({ name: cleanName })
                .eq('id', char.id);

            if (updateError) {
                console.error(`Failed to update ${char.id}:`, updateError);
            } else {
                updateCount++;
            }
        }
    }

    console.log(`Cleanup complete. Updated ${updateCount} characters.`);
}

cleanupNames();
