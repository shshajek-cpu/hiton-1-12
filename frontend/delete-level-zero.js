/**
 * Delete characters with level 0 (incomplete data)
 */

const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

async function deleteLevelZero() {
    console.log('Deleting level 0 characters...\n');

    try {
        // Step 1: Count level 0 characters
        console.log('Step 1: Counting level 0 characters...');
        const countUrl = `${SUPABASE_URL}/rest/v1/characters?select=count&level=eq.0`;

        const countResponse = await fetch(countUrl, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'count=exact'
            }
        });

        if (!countResponse.ok) {
            throw new Error(`Failed to count: ${countResponse.status}`);
        }

        const countData = await countResponse.json();
        const totalCount = countData[0]?.count || 0;

        console.log(`✓ Found ${totalCount} characters with level 0\n`);

        if (totalCount === 0) {
            console.log('No characters to delete!');
            return;
        }

        // Step 2: Delete in batches
        console.log('Step 2: Deleting characters...');
        console.log('This may take a few minutes...\n');

        let totalDeleted = 0;
        let batchNumber = 0;
        const BATCH_SIZE = 500; // Delete 500 at a time

        while (totalDeleted < totalCount) {
            batchNumber++;

            try {
                // Fetch a batch of IDs
                const fetchUrl = `${SUPABASE_URL}/rest/v1/characters?select=id&level=eq.0&limit=${BATCH_SIZE}`;

                const fetchResponse = await fetch(fetchUrl, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                if (!fetchResponse.ok) {
                    throw new Error(`Failed to fetch batch: ${fetchResponse.status}`);
                }

                const batch = await fetchResponse.json();

                if (batch.length === 0) {
                    console.log('\nNo more records to delete');
                    break;
                }

                // Delete this batch
                const deleteUrl = `${SUPABASE_URL}/rest/v1/characters?level=eq.0`;

                const deleteResponse = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (deleteResponse.ok) {
                    totalDeleted += batch.length;
                    const progress = Math.min(100, Math.round((totalDeleted / totalCount) * 100));
                    process.stdout.write(`\rBatch ${batchNumber}: Deleted ${totalDeleted}/${totalCount} (${progress}%)`);
                } else {
                    console.error(`\nError deleting batch ${batchNumber}: ${deleteResponse.status}`);
                    break;
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`\nError in batch ${batchNumber}:`, error.message);
                break;
            }
        }

        console.log(`\n\n✓ Deletion complete!`);
        console.log(`  Total deleted: ${totalDeleted}`);

        // Step 3: Verify
        console.log('\nStep 3: Verifying...');
        const verifyResponse = await fetch(countUrl, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'count=exact'
            }
        });

        if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            const remaining = verifyData[0]?.count || 0;

            if (remaining === 0) {
                console.log('✓ All level 0 characters have been removed!');
            } else {
                console.log(`⚠ Warning: ${remaining} level 0 characters still remain`);
            }
        }

    } catch (error) {
        console.error('\n✗ Fatal error:', error);
        process.exit(1);
    }
}

deleteLevelZero()
    .then(() => {
        console.log('\n✓ Script completed successfully!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n✗ Script failed:', error);
        process.exit(1);
    });
