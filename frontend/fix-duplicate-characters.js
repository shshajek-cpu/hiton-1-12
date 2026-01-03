/**
 * Fix Duplicate Characters
 *
 * This script:
 * 1. Finds characters with URL-encoded character_ids (%3D instead of =)
 * 2. Finds duplicate entries (same name + server + decoded character_id)
 * 3. Keeps the best entry and removes duplicates
 */

const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

async function fixDuplicates() {
    console.log('Starting duplicate character fix...\n');

    try {
        // Step 1: Fetch all characters
        console.log('Step 1: Fetching all characters...');
        const fetchUrl = `${SUPABASE_URL}/rest/v1/characters?select=id,character_id,name,server_id,class_name,level,created_at,updated_at&limit=10000`;

        const response = await fetch(fetchUrl, {
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
        console.log(`✓ Fetched ${characters.length} characters\n`);

        // Step 2: Group by decoded character_id + name + server_id
        console.log('Step 2: Analyzing duplicates...');
        const groups = {};

        for (const char of characters) {
            // Decode character_id
            const decodedId = decodeURIComponent(char.character_id);
            const key = `${decodedId}|${char.name}|${char.server_id}`;

            if (!groups[key]) {
                groups[key] = {
                    decodedId,
                    name: char.name,
                    serverId: char.server_id,
                    entries: []
                };
            }

            groups[key].entries.push(char);
        }

        // Find groups with duplicates
        const duplicates = Object.values(groups).filter(g => g.entries.length > 1);

        console.log(`Found ${duplicates.length} duplicate groups\n`);

        if (duplicates.length === 0) {
            console.log('No duplicates to fix!');
            return;
        }

        // Step 3: Determine which entries to keep and which to delete
        console.log('Step 3: Determining entries to keep/delete...\n');
        const toDelete = [];

        for (const group of duplicates) {
            console.log(`\nCharacter: ${group.name} (Server: ${group.serverId})`);
            console.log(`  Entries: ${group.entries.length}`);

            // Sort entries by priority:
            // 1. Has class_name !== 'Unknown'
            // 2. Most recently updated
            // 3. Most recently created
            const sorted = group.entries.sort((a, b) => {
                // Priority 1: Valid class name
                const aHasClass = a.class_name && a.class_name !== 'Unknown';
                const bHasClass = b.class_name && b.class_name !== 'Unknown';
                if (aHasClass !== bHasClass) return bHasClass ? 1 : -1;

                // Priority 2: Most recent update
                const aTime = new Date(a.updated_at || a.created_at);
                const bTime = new Date(b.updated_at || b.created_at);
                return bTime - aTime;
            });

            const toKeep = sorted[0];
            const toRemove = sorted.slice(1);

            console.log(`  KEEP: ID=${toKeep.id}, Class=${toKeep.class_name}, Lv${toKeep.level}`);
            toRemove.forEach(entry => {
                console.log(`  DELETE: ID=${entry.id}, Class=${entry.class_name}, Lv${entry.level}`);
                toDelete.push(entry);
            });
        }

        if (toDelete.length === 0) {
            console.log('\nNo entries to delete!');
            return;
        }

        console.log(`\n\nTotal entries to delete: ${toDelete.length}`);
        console.log('Proceeding with deletion...\n');

        // Step 4: Delete duplicate entries
        let deleted = 0;
        let errors = 0;

        for (const entry of toDelete) {
            try {
                const deleteUrl = `${SUPABASE_URL}/rest/v1/characters?id=eq.${entry.id}`;

                const deleteResponse = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (deleteResponse.ok) {
                    deleted++;
                    process.stdout.write(`\rDeleted: ${deleted}/${toDelete.length}`);
                } else {
                    errors++;
                    console.error(`\nError deleting ID ${entry.id}: ${deleteResponse.status}`);
                }
            } catch (error) {
                errors++;
                console.error(`\nError deleting ID ${entry.id}:`, error.message);
            }
        }

        console.log(`\n\n✓ Deletion complete!`);
        console.log(`  Successfully deleted: ${deleted}`);
        if (errors > 0) {
            console.log(`  Errors: ${errors}`);
        }

        // Step 5: Verify
        console.log('\nStep 5: Verifying...');
        const verifyResponse = await fetch(fetchUrl, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (verifyResponse.ok) {
            const afterChars = await verifyResponse.json();
            console.log(`Total characters after cleanup: ${afterChars.length}`);
            console.log(`Removed: ${characters.length - afterChars.length} entries`);
        }

    } catch (error) {
        console.error('\n✗ Fatal error:', error);
        process.exit(1);
    }
}

fixDuplicates()
    .then(() => {
        console.log('\n✓ Script completed successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n✗ Script failed:', error);
        process.exit(1);
    });
