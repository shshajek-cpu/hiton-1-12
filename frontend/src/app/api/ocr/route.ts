import { NextRequest, NextResponse } from 'next/server';

// Gemini OCR API (단일 슬롯 / 전체 모드 지원)
export async function POST(request: NextRequest) {
    try {
        const { image, mode = 'single' } = await request.json(); // mode: 'single' (개별 슬롯) | 'multi' (전체)

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_VISION_API_KEY;

        if (!GEMINI_API_KEY) {
            console.error('[OCR API] Missing Gemini API key');
            return NextResponse.json({ error: 'OCR service not configured' }, { status: 500 });
        }

        // base64 데이터에서 prefix 제거 및 mime type 추출
        const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
        let mimeType = 'image/png';
        let base64Data = image;

        if (matches) {
            mimeType = matches[1];
            base64Data = matches[2];
        } else {
            base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        }

        // 단일 슬롯 모드용 프롬프트 (간결하고 집중적)
        const singleSlotPrompt = `이 이미지에서 캐릭터 이름과 서버명을 추출하세요.

형식: 캐릭터명[서버명]
예시: 로캐[무닌]

## 한글 구분 (매우 중요!)
- ㅐ vs ㅣ: 캐≠키, 배≠비, 래≠리 (ㅐ는 세로선+짧은가로선, ㅣ는 세로선만)
- ㄲ vs ㄱ: 꼰≠곤, 까≠가
- ㄸ vs ㄷ: 똘≠돌, 따≠다
- ㅂ vs ㅎ: 밥≠합, 반≠한

출력: 캐릭터명[서버명] (이 형식만, 설명 없이)`;

        // 전체 모드용 프롬프트 (기존)
        const multiSlotPrompt = `이 게임 스크린샷에서 파티원 정보를 정확히 추출하세요.

## 형식
- 각 파티원은 "캐릭터명[서버명]" 형태로 표시됩니다

## 출력 형식
캐릭터명1[서버명1]
캐릭터명2[서버명2]
캐릭터명3[서버명3]
캐릭터명4[서버명4]

## 한글 구분 (중요!)
- ㅐ vs ㅣ: 캐≠키, 배≠비 (ㅐ는 세로선+가로선)
- ㄲ vs ㄱ: 꼰≠곤
- ㄸ vs ㄷ: 똘≠돌
- ㅂ vs ㅎ: 밥≠합

설명 없이 형식만 출력하세요.`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: mode === 'single' ? singleSlotPrompt : multiSlotPrompt
                        },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 1024
            }
        };

        console.log('[OCR API] Calling Gemini 2.5 Flash Lite...');

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[OCR API] Gemini error:', response.status, errorText);
            return NextResponse.json({ error: `OCR failed: ${response.status}` }, { status: response.status });
        }

        const result = await response.json();
        console.log('[OCR API] Gemini response:', JSON.stringify(result).substring(0, 500));

        // Gemini 결과에서 텍스트 추출
        let extractedText = '';
        if (result.candidates && result.candidates[0]?.content?.parts) {
            extractedText = result.candidates[0].content.parts
                .map((part: any) => part.text || '')
                .join('\n');
        }

        console.log('[OCR API] Extracted text:', extractedText);

        return NextResponse.json({
            success: true,
            text: extractedText,
            raw: result
        });

    } catch (error: any) {
        console.error('[OCR API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
