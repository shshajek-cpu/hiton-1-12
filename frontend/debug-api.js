// Debug script to see raw API response structure (correct endpoint)
const fetch = require('node-fetch');

async function debugApiResponse() {
    const name = '아이';
    const url = `https://aion2.plaync.com/ko-kr/api/search/aion2/search/v2/character?keyword=${encodeURIComponent(name)}&page=1&size=5`;

    console.log('Fetching from:', url);

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://aion2.plaync.com/',
        'Accept': 'application/json'
    };

    try {
        const res = await fetch(url, { headers });
        const data = await res.json();

        console.log('\n=== RAW API RESPONSE STRUCTURE ===\n');

        if (data.list && data.list.length > 0) {
            // Show first 3 items with all their fields
            data.list.slice(0, 3).forEach((item, i) => {
                console.log(`\n--- Character ${i + 1} ---`);
                console.log('All fields:', Object.keys(item));
                console.log('pcId:', item.pcId, '(type:', typeof item.pcId, ')');
                console.log('className:', item.className);
                console.log('jobName:', item.jobName);
                console.log('characterId:', item.characterId);
                console.log('name:', item.name);
                console.log('level:', item.level);
                console.log('\nFull item JSON:');
                console.log(JSON.stringify(item, null, 2));
            });
        } else {
            console.log('No list found. Response keys:', Object.keys(data));
            console.log('Full response:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

debugApiResponse();
