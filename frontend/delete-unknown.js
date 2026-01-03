
const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

async function deleteUnknownClasses() {
    console.log('Deleting characters with Unknown class...\n');

    try {
        // 1. Count records to be deleted
        const countUrl = `${SUPABASE_URL}/rest/v1/characters?select=id&class_name=eq.Unknown&head=true`;
        const countRes = await fetch(countUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'count=exact'
            }
        });

        // head=true request might not return body, but the count is in content-range usually or just use a select count
        // Actually simpler to just fetch and delete or delete directly.
        // Let's try direct delete.

        console.log('Executing DELETE query...');

        const deleteUrl = `${SUPABASE_URL}/rest/v1/characters?class_name=eq.Unknown`;
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' // To get back what was deleted
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete: ${response.status} ${response.statusText}`);
        }

        const deletedData = await response.json();
        console.log(`\n✓ Successfully deleted ${deletedData.length} characters.`);

    } catch (error) {
        console.error('\n✗ Error:', error);
        process.exit(1);
    }
}

deleteUnknownClasses();
