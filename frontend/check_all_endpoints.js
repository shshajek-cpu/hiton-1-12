const https = require('https');

// 공식 홈페이지에서 사용 가능한 모든 character API 엔드포인트 확인
const characterId = 'A1pIWbd0UKoTYJ2XbL_Cw8P2paCGuL6EtLx38RtpZ3U=';
const serverId = '1001';

const endpoints = [
    `/api/character/info?lang=ko&characterId=${characterId}&serverId=${serverId}`,
    `/api/character/equipment?lang=ko&characterId=${characterId}&serverId=${serverId}`,
    `/api/character/stat?lang=ko&characterId=${characterId}&serverId=${serverId}`,
    `/api/character/detail?lang=ko&characterId=${characterId}&serverId=${serverId}`,
    `/api/character/power?lang=ko&characterId=${characterId}&serverId=${serverId}`,
    `/api/character/combat?lang=ko&characterId=${characterId}&serverId=${serverId}`,
    `/api/character/cp?lang=ko&character Id=${characterId}&serverId=${serverId}`,
];

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://aion2.plaync.com/',
        'Accept': 'application/json'
    }
};

async function checkEndpoint(path) {
    return new Promise((resolve) => {
        const url = `https://aion2.plaync.com${path}`;

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ path, status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ path, status: res.statusCode, error: 'Invalid JSON', data: data.substring(0, 200) });
                }
            });
        }).on('error', (err) => {
            resolve({ path, status: 'ERROR', error: err.message });
        });
    });
}

(async () => {
    console.log('=== CHECKING ALL POSSIBLE CHARACTER API ENDPOINTS ===\n');

    for (const endpoint of endpoints) {
        const result = await checkEndpoint(endpoint);
        console.log(`\nEndpoint: ${result.path}`);
        console.log(`Status: ${result.status}`);

        if (result.status === 200 && result.data && !result.error) {
            console.log('SUCCESS! Keys:', Object.keys(result.data));

            // Search for combat power
            const searchCP = (obj, path = '') => {
                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === 'number' && value >= 3000 && value <= 3100) {
                        console.log(`  FOUND NUMBER: ${path}${key} = ${value}`);
                    }
                    if (typeof value === 'object' && value !== null && !Array.isArray(value) && path.length < 10) {
                        searchCP(value, `${path}${key}.`);
                    }
                }
            };
            searchCP(result.data);
        } else if (result.error) {
            console.log(`Error: ${result.error}`);
        } else {
            console.log('No data or non-200 response');
        }
    }
})();
