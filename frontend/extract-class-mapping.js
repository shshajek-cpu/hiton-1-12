/**
 * Extract pcId to className mapping from database
 */

const SUPABASE_URL = 'https://mnbngmdjiszyowfvnzhk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uYm5nbWRqaXN6eW93ZnZuemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5OTY0ODAsImV4cCI6MjA4MjU3MjQ4MH0.AIvvGxd_iQKpQDbmOBoe4yAmii1IpB92Pp7Scs8Lz7U';

async function extractMapping() {
    console.log('Extracting pcId to className mapping...\n');

    try {
        // Fetch characters with profile data
        const url = `${SUPABASE_URL}/rest/v1/characters?select=profile,class_name&class_name=neq.Unknown&limit=100`;

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
        console.log(`Fetched ${characters.length} characters with class info\n`);

        // Extract unique pcId -> className mappings
        const mappings = new Map();

        for (const char of characters) {
            if (char.profile && char.profile.pcId && char.class_name) {
                const pcId = char.profile.pcId;
                const className = char.class_name;

                if (!mappings.has(pcId)) {
                    mappings.set(pcId, className);
                } else if (mappings.get(pcId) !== className) {
                    console.warn(`WARNING: pcId ${pcId} has multiple class names: ${mappings.get(pcId)} and ${className}`);
                }
            }
        }

        console.log('pcId to className Mapping:\n');
        console.log('```javascript');
        console.log('const PC_ID_TO_CLASS_NAME = {');

        // Sort by pcId
        const sorted = Array.from(mappings.entries()).sort((a, b) => a[0] - b[0]);

        for (const [pcId, className] of sorted) {
            console.log(`    ${pcId}: '${className}',`);
        }

        console.log('};');
        console.log('```\n');

        console.log(`Total mappings: ${mappings.size}`);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

extractMapping()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
