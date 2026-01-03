export interface RecentCharacter {
    id: string;          // server_id + '_' + character_name
    name: string;        // Character Name
    server: string;      // Server Name (e.g., Siel)
    serverId: number;    // Server ID
    race: string;        // Race (elyos/asmodian)
    class: string;       // Class Name
    level: number;       // Character Level
    itemLevel: number;   // Item Level (Combat Power-like metric)
    profileImage: string;// Profile Image URL
    timestamp: number;   // Timestamp for sorting
}

export interface RankingCharacter {
    character_id: string;
    server_id: number;
    name: string;
    level: number;
    class_name: string;
    race_name: string;
    guild_name?: string;
    combat_power?: number;
    profile_image?: string;
    noa_score?: number;
    ranking_ap?: number;
    ranking_gp?: number;
}
