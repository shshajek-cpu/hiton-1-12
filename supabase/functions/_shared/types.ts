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
    titleId: number;
    titleName: string;
    titleGrade: string;
    profileImage: string;
}

export interface AionCharacterInfoResponse {
    profile: AionCharacterProfile;
    stat: {
        statList: any[];
    };
    title: {
        totalCount: number;
        ownedCount: number;
        titleList: any[];
    };
    ranking: {
        rankingList: any[];
    };
    daevanion: {
        boardList: any[];
    };
}

export interface AionCharacterEquipmentResponse {
    equipment: {
        equipmentList: any[];
        skinList: any[];
    };
    skill: {
        skillList: any[];
    };
    petwing: {
        pet: any;
        wing: any;
    };
}

export interface DbCharacter {
    id?: string;
    character_id: string;
    server_id: number;
    name: string;
    level: number;
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
