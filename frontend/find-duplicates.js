/**
 * Find duplicate characters (same name + same server)
 */

const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

async function findDuplicates() {
    console.log('Searching for duplicate characters...\n');

    try {
        // Fetch all characters
        const fetchUrl = `${SUPABASE_URL}/rest/v1/characters?select=character_id,name,server_id,class_name,level,race_name,created_at,updated_at,scraped_at&limit=10000`;

        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const characters = await response.json();
        console.log(`Fetched ${characters.length} characters\n`);

        // Group by name + server_id
        const groups = {};
        for (const char of characters) {
            const key = `${char.name}|${char.server_id}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(char);
        }

        // Find duplicates (groups with more than 1 character)
        const duplicates = Object.entries(groups).filter(([key, chars]) => chars.length > 1);

        if (duplicates.length === 0) {
            console.log('No duplicates found!');
            return;
        }

        console.log(`Found ${duplicates.length} duplicate character names:\n`);

        for (const [key, chars] of duplicates) {
            const [name, serverId] = key.split('|');
            console.log(`\n${'='.repeat(80)}`);
            console.log(`Character: ${name} (Server: ${serverId})`);
            console.log(`Count: ${chars.length} entries`);
            console.log(`${'='.repeat(80)}`);

            // Sort by created_at
            chars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

            chars.forEach((char, idx) => {
                console.log(`\n[${idx + 1}] Character ID: ${char.character_id.substring(0, 20)}...`);
                console.log(`    Class: ${char.class_name || 'Unknown'}`);
                console.log(`    Level: ${char.level}`);
                console.log(`    Race: ${char.race_name}`);
                console.log(`    Created: ${char.created_at}`);
                console.log(`    Updated: ${char.updated_at}`);
                console.log(`    Scraped: ${char.scraped_at || 'Never'}`);
            });

            // Identify which one to keep (most recently updated)
            const latest = chars.reduce((prev, current) => {
                const prevTime = new Date(prev.updated_at || prev.created_at);
                const currTime = new Date(current.updated_at || current.created_at);
                return currTime > prevTime ? current : prev;
            });

            console.log(`\n>>> RECOMMENDED TO KEEP: ${latest.character_id.substring(0, 20)}... (${latest.class_name}, Lv${latest.level})`);
        }

        console.log(`\n\n${'='.repeat(80)}`);
        console.log(`SUMMARY: Found ${duplicates.length} duplicate character names`);
        console.log(`Total duplicate entries: ${duplicates.reduce((sum, [_, chars]) => sum + chars.length, 0)}`);
        console.log(`Entries to potentially remove: ${duplicates.reduce((sum, [_, chars]) => sum + chars.length - 1, 0)}`);
        console.log(`${'='.repeat(80)}\n`);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

findDuplicates()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
