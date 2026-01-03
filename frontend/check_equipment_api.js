const https = require('https');

// 공식 AION2 Equipment API 직접 호출
const url = 'https://aion2.plaync.com/api/character/equipment?lang=ko&characterId=A1pIWbd0UKoTYJ2XbL_Cw8P2paCGuL6EtLx38RtpZ3U=&serverId=1001';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://aion2.plaync.com/',
        'Accept': 'application/json'
    }
};

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => { data += chunk; });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            console.log('\n=== EQUIPMENT API RESPONSE STRUCTURE ===');
            console.log('Top level keys:', Object.keys(json));

            console.log('\n=== EQUIPMENT KEYS ===');
            console.log(Object.keys(json.equipment || {}));

            console.log('\n=== SEARCHING FOR 3047 or combat power ===');
            const searchNumber = (obj, path = '') => {
                for (const key in obj) {
                    const value = obj[key];
                    const currentPath = path ? `${path}.${key}` : key;

                    if (typeof value === 'number' && value >= 3000 && value <= 3100) {
                        console.log(`FOUND NUMBER: ${currentPath} = ${value}`);
                    }

                    if (key.toLowerCase().includes('combat') ||
                        key.toLowerCase().includes('power') ||
                        key.toLowerCase().includes('cp') ||
                        key.includes('전투')) {
                        console.log(`FOUND KEY: ${currentPath} = ${value}`);
                    }

                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        searchNumber(value, currentPath);
                    }
                }
            };

            searchNumber(json);

            // Check equipment.stat if exists
            if (json.equipment && json.equipment.stat) {
                console.log('\n=== EQUIPMENT.STAT ===');
                console.log(JSON.stringify(json.equipment.stat, null, 2));
            }

        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
            console.log('Response status:', res.statusCode);
        }
    });
}).on('error', (err) => {
    console.error('Request failed:', err.message);
});
