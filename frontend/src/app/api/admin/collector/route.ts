import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// 전체 서버 목록
const SERVERS = [
    { id: 1001, name: '시엘' }, { id: 1002, name: '네자칸' }, { id: 1003, name: '바이젤' },
    { id: 1004, name: '카이시넬' }, { id: 1005, name: '유스티엘' }, { id: 1006, name: '아리엘' },
    { id: 1007, name: '프레기온' }, { id: 1008, name: '메스람타에다' }, { id: 1009, name: '히타니에' },
    { id: 1010, name: '나니아' }, { id: 1011, name: '타하바타' }, { id: 1012, name: '루터스' },
    { id: 1013, name: '페르노스' }, { id: 1014, name: '다미누' }, { id: 1015, name: '카사카' },
    { id: 1016, name: '바카르마' }, { id: 1017, name: '챈가룽' }, { id: 1018, name: '코치룽' },
    { id: 1019, name: '이슈타르' }, { id: 1020, name: '티아마트' }, { id: 1021, name: '포에타' },
    { id: 2001, name: '이스라펠' }, { id: 2002, name: '지켈' }, { id: 2003, name: '트리니엘' },
    { id: 2004, name: '루미엘' }, { id: 2005, name: '마르쿠탄' }, { id: 2006, name: '아스펠' },
    { id: 2007, name: '에레슈키갈' }, { id: 2008, name: '브리트라' }, { id: 2009, name: '네몬' },
    { id: 2010, name: '하달' }, { id: 2011, name: '루드라' }, { id: 2012, name: '울고른' },
    { id: 2013, name: '무닌' }, { id: 2014, name: '오다르' }, { id: 2015, name: '젠카카' },
    { id: 2016, name: '크로메데' }, { id: 2017, name: '콰이링' }, { id: 2018, name: '바바룽' },
    { id: 2019, name: '파프니르' }, { id: 2020, name: '인드나흐' }, { id: 2021, name: '이스할겐' }
]

export async function GET(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        // 랜덤 서버 선택
        const randomServer = SERVERS[Math.floor(Math.random() * SERVERS.length)]

        // 의미 없는 조합 대신 실존 확률이 높은 키워드 사용
        const KEYWORDS = [
            // 직업 (가장 많음)
            '검성', '수호', '살성', '궁성', '마도', '정령', '치유', '호법',
            '기사', '전사', '도적', '법사', '사제', '힐러', '탱커', '딜러',
            // 게임 용어
            '지존', '초보', '고수', '신', '악마', '천사', '영웅', '전설', '신화',
            '군주', '대장', '왕', '황제', '장군', '대박', '축복', '저주',
            // 자연
            '하늘', '바다', '구름', '바람', '태양', '달', '별', '우주', '지구', '자연',
            '노을', '새벽', '아침', '점심', '저녁', '밤', '봄', '여름', '가을', '겨울',
            // 동물
            '사자', '호랑', '늑대', '여우', '곰', '용', '드래곤', '피닉스', '독수리',
            // 색상
            '블랙', '화이트', '레드', '블루', '골드', '실버', '그린', '핑크',
            // 감정/상태
            '사랑', '행복', '희망', '기쁨', '슬픔', '분노', '자유', '평화', '승리',
            // 한 글자 (성씨 - 의외로 많음)
            '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
            '한', '오', '서', '신', '권', '황', '안', '송', '류', '홍'
        ]

        const randomKeyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]

        // 검색 결과 다양화를 위해 페이지도 랜덤 (1~5)
        const randomPage = Math.floor(Math.random() * 5) + 1

        console.log(`[Collector] Searching "${randomKeyword}" on ${randomServer.name} (Page ${randomPage})...`)

        const searchUrl = new URL('https://aion2.plaync.com/ko-kr/api/search/aion2/search/v2/character')
        searchUrl.searchParams.append('keyword', randomKeyword)
        searchUrl.searchParams.append('serverId', randomServer.id.toString())
        searchUrl.searchParams.append('page', randomPage.toString())
        searchUrl.searchParams.append('size', '50')

        const response = await fetch(searchUrl.toString(), {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://aion2.plaync.com/'
            }
        })

        if (!response.ok) {
            console.error(`[Collector] API Failed: ${response.status} ${response.statusText}`)
            // 실패 로그 저장
            await supabase.from('collector_logs').insert({
                server_name: randomServer.name,
                keyword: `${randomKeyword} (Error ${response.status})`,
                collected_count: 0,
                type: 'auto'
            })

            return NextResponse.json({
                error: 'Search API failed',
                status: response.status,
                server: randomServer.name,
                keyword: randomKeyword
            }, { status: 200 }) // Frontend 처리를 위해 200 반환 (단 에러 내용은 포함)
        }

        const data = await response.json()
        const characters = data.list || []

        // pcId를 직업명으로 변환
        const pcIdToClassName: Record<number, string> = {
            6: '검성', 7: '검성', 8: '검성', 9: '검성',
            10: '수호성', 11: '수호성', 12: '수호성', 13: '수호성',
            14: '궁성', 15: '궁성', 16: '궁성', 17: '궁성',
            18: '살성', 19: '살성', 20: '살성', 21: '살성',
            22: '정령성', 23: '정령성', 24: '정령성', 25: '정령성',
            26: '마도성', 27: '마도성', 28: '마도성', 29: '마도성',
            30: '치유성', 31: '치유성', 32: '치유성', 33: '치유성',
            34: '호법성', 35: '호법성', 36: '호법성', 37: '호법성'
        }

        // DB에 저장할 데이터 준비
        const charactersToUpsert = characters
            .filter((item: any) => item.characterName) // 이름 없는 데이터 필터링
            .map((item: any) => ({
                character_id: item.characterId,
                name: item.characterName?.replace(/<[^>]*>/g, '') || item.characterName,
                server_id: item.serverId,
                // server_name: 컬럼이 없어서 에러 발생으로 제거
                class_name: pcIdToClassName[item.pcId] || null,
                race_name: item.race === 1 ? 'Elyos' : 'Asmodian',
                level: item.level,
                profile_image: item.profileImageUrl?.startsWith('http')
                    ? item.profileImageUrl
                    : item.profileImageUrl ? `https://profileimg.plaync.com${item.profileImageUrl}` : null,
                scraped_at: new Date().toISOString()
            }))

        // DB에 upsert
        const { error, count } = await supabase
            .from('characters')
            .upsert(charactersToUpsert, {
                onConflict: 'character_id',
                ignoreDuplicates: false
            })

        if (error) {
            console.error('[Collector] Upsert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`[Collector] Saved ${charactersToUpsert.length} characters from ${randomServer.name}`)

        // 수집 로그 저장
        await supabase.from('collector_logs').insert({
            server_name: randomServer.name,
            keyword: randomKeyword,
            collected_count: charactersToUpsert.length,
            type: 'auto'
        })

        // 현재 전체 캐릭터 수 조회
        const { count: totalCount } = await supabase
            .from('characters')
            .select('*', { count: 'exact', head: true })

        return NextResponse.json({
            message: `Collected ${charactersToUpsert.length} characters`,
            server: randomServer.name,
            keyword: randomKeyword,
            totalCharacters: totalCount,
            new_characters: charactersToUpsert.map((c: any) => ({
                id: c.character_id,
                server: c.server_id,
                name: c.name
            }))
        })

    } catch (err: any) {
        console.error('[Collector Error]', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
