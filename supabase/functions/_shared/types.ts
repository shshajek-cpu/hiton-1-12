export interface AionServer {
    id: number;
    name: string;
    raceId?: number;
}

export interface CharacterSearchResult {
    characterId: string;
    name: string;
    race: number;
    pcId: number;
    level: number;
    serverId: number;
    serverName: string;
    profileImageUrl: string;
}

export interface CharacterSearchResponse {
    list: CharacterSearchResult[];
    pagination: {
        page: number;
        size: number;
        total: number;
        endPage: number;
    };
}

export interface AionCharacterProfile {
    characterId: string;
    characterName: string;
    serverId: number;
    serverName: string;
    regionName: string;
    pcId: number;
    className: string;
    raceId: number;
    raceName: string;
    gender: number;
    genderName: string;
    characterLevel: number;
    jobLevel?: number; // Added
    titleId: number;
    titleName: string;
    titleGrade: string;
    profileImage: string;
}

// ... (omitted)

export interface DbCharacter {
    id?: string;
    character_id: string;
    server_id: number;
    name: string;
    level: number;
    item_level?: number;
    noa_score?: number; // Added for Ranking System
    ranking_ap?: number; // Abyss Points
    ranking_gp?: number; // Glory Points
    class_name: string;
    race_name: string;
    guild_name?: string;
    combat_power?: number;
    profile_image: string;
    profile: any;
    stats: any;
    titles: any;
    rankings: any;
    daevanion: any;
    equipment: any;
    skills: any;
    pet_wing: any;
    scraped_at?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Normalize race name to English standard format
 * Converts Korean race names and various formats to consistent English values
 */
export function normalizeRaceName(raceValue: any, raceName?: string): string {
    // First check raceName string if provided
    if (typeof raceName === 'string') {
        const normalized = raceName.toLowerCase().trim();
        if (normalized.includes('천족') || normalized.includes('elyos')) {
            return 'Elyos';
        }
        if (normalized.includes('마족') || normalized.includes('asmodian')) {
            return 'Asmodian';
        }
    }

    // Check numeric race ID
    if (typeof raceValue === 'number') {
        // Based on AION API: 2 = Asmodian, 0/1 = Elyos
        if (raceValue === 2) return 'Asmodian';
        if (raceValue === 0 || raceValue === 1) return 'Elyos';
    }

    // Check string value
    if (typeof raceValue === 'string') {
        const normalized = raceValue.toLowerCase().trim();
        if (normalized === 'elyos' || normalized === '천족' || normalized === '1' || normalized === '0') {
            return 'Elyos';
        }
        if (normalized === 'asmodian' || normalized === '마족' || normalized === '2') {
            return 'Asmodian';
        }
    }

    // Default fallback - log warning in production
    console.warn(`Unable to normalize race: ${raceValue}, ${raceName}. Defaulting to Asmodian`);
    return 'Asmodian';
}
