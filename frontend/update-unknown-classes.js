/**
 * Update Unknown class names using profile.pcId
 */

const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

const PC_ID_TO_CLASS_NAME = {
    7: '검성',
    11: '수호성',
    20: '살성',
    28: '마도성',
    36: '호법성',
};

async function updateUnknownClasses() {
    console.log('Updating Unknown class names...\n');

    try {
        // Fetch characters with Unknown class
        console.log('Step 1: Fetching characters with Unknown class...');
        const url = `${SUPABASE_URL}/rest/v1/characters?select=id,character_id,name,class_name,profile&class_name=eq.Unknown&limit=1000`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const characters = await response.json();
        console.log(`✓ Found ${characters.length} characters with Unknown class\n`);

        if (characters.length === 0) {
            console.log('No characters to update!');
            return;
        }

        // Determine which can be updated
        console.log('Step 2: Analyzing update candidates...');
        const toUpdate = [];
        const cannotUpdate = [];

        for (const char of characters) {
            if (char.profile && char.profile.pcId) {
                const className = PC_ID_TO_CLASS_NAME[char.profile.pcId];
                if (className) {
                    toUpdate.push({
                        id: char.id,
                        name: char.name,
                        pcId: char.profile.pcId,
                        newClassName: className
                    });
                } else {
                    cannotUpdate.push({
                        name: char.name,
                        pcId: char.profile.pcId,
                        reason: 'Unknown pcId mapping'
                    });
                }
            } else {
                cannotUpdate.push({
                    name: char.name,
                    reason: 'No profile.pcId available'
                });
            }
        }

        console.log(`Can update: ${toUpdate.length}`);
        console.log(`Cannot update: ${cannotUpdate.length}\n`);

        if (cannotUpdate.length > 0) {
            console.log('Characters that cannot be updated:');
            cannotUpdate.slice(0, 10).forEach(char => {
                console.log(`  - ${char.name}: ${char.reason}${char.pcId ? ` (pcId: ${char.pcId})` : ''}`);
            });
            if (cannotUpdate.length > 10) {
                console.log(`  ... and ${cannotUpdate.length - 10} more\n`);
            } else {
                console.log('');
            }
        }

        if (toUpdate.length === 0) {
            console.log('No characters can be updated!');
            return;
        }

        // Update characters
        console.log(`Step 3: Updating ${toUpdate.length} characters...\n`);
        let updated = 0;
        let errors = 0;

        for (const char of toUpdate) {
            try {
                const updateUrl = `${SUPABASE_URL}/rest/v1/characters?id=eq.${char.id}`;

                const updateResponse = await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        class_name: char.newClassName,
                        updated_at: new Date().toISOString()
                    })
                });

                if (updateResponse.ok) {
                    updated++;
                    if (updated % 10 === 0 || updated === toUpdate.length) {
                        process.stdout.write(`\rUpdated: ${updated}/${toUpdate.length} (${Math.round(updated / toUpdate.length * 100)}%)`);
                    }
                } else {
                    errors++;
                    console.error(`\nError updating ${char.name}: ${updateResponse.status}`);
                }
            } catch (error) {
                errors++;
                console.error(`\nError updating ${char.name}:`, error.message);
            }
        }

        console.log(`\n\n✓ Update complete!`);
        console.log(`  Successfully updated: ${updated}`);
        if (errors > 0) {
            console.log(`  Errors: ${errors}`);
        }

        // Show class distribution
        console.log('\nUpdated class distribution:');
        const classCounts = {};
        toUpdate.forEach(char => {
            classCounts[char.newClassName] = (classCounts[char.newClassName] || 0) + 1;
        });
        Object.entries(classCounts).sort((a, b) => b[1] - a[1]).forEach(([className, count]) => {
            console.log(`  ${className}: ${count}`);
        });

    } catch (error) {
        console.error('\n✗ Fatal error:', error);
        process.exit(1);
    }
}

updateUnknownClasses()
    .then(() => {
        console.log('\n✓ Script completed successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n✗ Script failed:', error);
        process.exit(1);
    });
