const http = require('http');

const url = 'http://localhost:3000/api/character?id=A1pIWbd0UKoTYJ2XbL_Cw8P2paCGuL6EtLx38RtpZ3U=&server=1001';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => { data += chunk; });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            console.log('\n=== STAT KEYS ===');
            console.log(Object.keys(json.stats || {}));

            console.log('\n=== DEBUG STATLIST (first 3 items) ===');
            const statList = json._debug_statList || json.stats?.statList || [];
            console.log(JSON.stringify(statList.slice(0, 3), null, 2));

            console.log('\n=== SEARCHING FOR COMBAT POWER ===');
            statList.forEach((item, idx) => {
                if (item.name && (
                    item.name.includes('전투') ||
                    item.name.includes('Combat') ||
                    item.name.includes('Power') ||
                    item.name.includes('CP')
                )) {
                    console.log(`FOUND at index ${idx}:`, JSON.stringify(item, null, 2));
                }
            });

            console.log('\n=== DEBUG CP VALUE ===');
            console.log('_debug_combatPower:', json._debug_combatPower);
            console.log('_debug_cpStat:', JSON.stringify(json._debug_cpStat, null, 2));

        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
            console.log('Raw response:', data.substring(0, 500));
        }
    });
}).on('error', (err) => {
    console.error('Request failed:', err.message);
});
