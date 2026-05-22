export type CharacterFaction = 'Ceria' | 'Fantasi' | 'Alam';

export interface Character {
  id: string;
  name: string;
  nickname: string;
  faction: CharacterFaction;
  description: string;
  avatarColor: string;
  borderColor: string;
  textColor: string;
  quotes: string[];
}

export interface Card {
  id: string;
  characterId: string;
  name: string; // e.g. "Piknik Ceria Bersama"
  rarity: 3 | 4 | 5; // Stars
  faction: CharacterFaction;
  bonusMultiplier: number; // For score boosts
  imagePrompt: string; // Used for descriptive layouts
  artStyle: string; // Aesthetic theme, e.g. "Steampunk", "Garden Picnic", "Chibi Star"
  unlockedQuote: string;
}

export type NoteType = 'tap' | 'hold' | 'flick';

export interface ChartNote {
  id: string;
  timeMs: number; // When the note hits the bar
  lane: number; // 0, 1, 2, 3
  type: NoteType;
  durationMs?: number; // Only for hold notes
  hitRating?: 'PERFECT' | 'GREAT' | 'MISS' | null;
}

export interface Song {
  id: string;
  title: string;
  composer: string;
  bpm: number;
  difficulty: 'Easy' | 'Normal' | 'Hard';
  stars: number;
  durationSeconds: number;
  notes: ChartNote[];
  primaryToneHz: number; // Tone base for dynamic synthesizer
  description: string;
}

export interface StoryNode {
  id: string;
  characterName: string;
  expression: 'SENANG' | 'BINGUNG' | 'SEMANGAT' | 'SERIUS' | 'BIASA';
  dialogue: string;
}

export interface Chapter {
  id: string;
  title: string;
  faction: CharacterFaction;
  summary: string;
  unlockCostPoints: number;
  nodes: StoryNode[];
}

export interface PlayerStats {
  level: number;
  xp: number;
  magicGems: number;
  starDust: number;
  unlockedCardIds: string[]; // Owned cards
  unlockedChapterIds: string[]; // Completed stories
  highScores: Record<string, number>; // songId -> score
  maxCombos: Record<string, number>; // songId -> combo
  activeFrontmanId: string; // The selected frontman card
  cardUpgrades: Record<string, number>; // cardId -> upgrade level
}
