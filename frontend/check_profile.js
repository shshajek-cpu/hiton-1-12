const http = require('http');

const url = 'http://localhost:3000/api/character?id=A1pIWbd0UKoTYJ2XbL_Cw8P2paCGuL6EtLx38RtpZ3U=&server=1001';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => { data += chunk; });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            console.log('\n=== PROFILE KEYS ===');
            console.log(Object.keys(json.profile || {}));

            console.log('\n=== PROFILE CONTENT ===');
            console.log(JSON.stringify(json.profile, null, 2));

            console.log('\n=== STATS KEYS ===');
            console.log(Object.keys(json.stats || {}));

            console.log('\n=== LOOKING FOR COMBAT POWER IN STATS ===');
            const stats = json.stats || {};
            Object.keys(stats).forEach(key => {
                if (key.toLowerCase().includes('combat') ||
                    key.toLowerCase().includes('power') ||
                    key.toLowerCase().includes('cp') ||
                    key.includes('전투')) {
                    console.log(`${key}:`, stats[key]);
                }
            });

            // Check if there are any numeric values that could be combat power (3000-5000 range)
            console.log('\n=== NUMERIC VALUES IN STATS (possible CP) ===');
            Object.keys(stats).forEach(key => {
                const val = stats[key];
                if (typeof val === 'number' && val >= 2000 && val <= 5000) {
                    console.log(`${key}: ${val}`);
                }
            });

        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Request failed:', err.message);
});
