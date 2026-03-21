// 角色表情
export interface Expression {
  name: string;
  file: string;
}

// 角色三围
export interface CharacterMeasurements {
  bust: number;
  waist: number;
  hip: number;
}

// 角色特有道具（伴生道具）
export interface CharacterItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// 角色基础信息（全局）
export interface Character {
  id: string;
  name: string;
  // 基本资料
  height: string;
  birthday: string;
  measurements: CharacterMeasurements;
  // 图片
  avatar: string;       // 头像（圆形裁剪）
  cover: string;        // 封面图（角色卡展示）
  reference: string;    // 参考立绘
  // 描述
  outfit: string;       // 衣着描述
  personality: string;  // 性格描述
  speakingStyle: string; // 说话风格参考（给AI用）
  // 特有道具
  items: CharacterItem[];
  // 表情差分
  expressions: Expression[];
}

// 世界书条目
export interface WorldBookEntry {
  keyword: string;
  content: string;
  category?: 'lore' | 'location' | 'rule' | 'other';
}

// 世界书
export interface WorldBook {
  id: string;
  name: string;
  description?: string;
  entries: WorldBookEntry[];
}

// 道具设定
export interface ItemEntry {
  id: string;
  name: string;
  description: string;
  effect?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// 角色在剧本中的设定
export interface ScriptCharacter {
  characterId: string;
  role: string;
  stats: {
    STR: number;
    AGI: number;
    INT: number;
    HP: number;
    [key: string]: number;
  };
  scriptPersonality: string;
  systemPrompt: string; // 隐藏，玩家不可见
}

// 正则脚本
export interface RegexScript {
  id: string;
  name: string;
  description: string;
  type: 'input' | 'output';
  findPattern: string;
  replacePattern: string;
  enabled: boolean;
}

// 游戏剧本（核心单元）
export interface GameScript {
  id: string;
  name: string;
  description: string;
  cover: string;
  author?: string;
  version?: string;
  participantCount: number;
  isNSFW?: boolean; // 添加 NSFW 标记
  openingPrompt: string;
  worldBooks: WorldBook[];
  items: ItemEntry[];
  characters: ScriptCharacter[];
  regexScripts: RegexScript[];
}

// AI 规则
export interface AIRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  prompt: string;
}

// AI 总规则配置
export interface AIRulesConfig {
  rules: AIRule[];
  bannedPatterns: string[];
}

// 聊天消息
export interface ChatMessage {
  id: string;
  type: 'dm' | 'character' | 'player' | 'system';
  characterId?: string;
  characterName?: string;
  expression?: string;
  content: string;
  timestamp: number;
}

// 存档
export interface SaveSlot {
  id: number;
  name: string;
  scriptId: string;
  scriptName: string;
  selectedCharacters: string[];
  messages: ChatMessage[];
  savedAt: number;
  playTime: number; // 游玩时长（秒）
}

// 玩家设置
export interface PlayerSettings {
  name: string;
  // API 配置
  apiKey: string;
  apiProvider: 'openai' | 'claude' | 'custom';
  apiEndpoint?: string;
  apiModel: string;
  // AI 参数
  contextLength: number; // 4096 - 999999
  temperature: number; // 0 - 2
  enableStreaming: boolean;
  // 游戏设置
  useScriptBackground: boolean;
  autoScroll: boolean;
  // Token 优化
  compressPrompt: boolean;       // 使用压缩提示词
  maxHistoryMessages: number;    // 最大历史消息数（0=不限）
}

// 当前游戏状态
export interface GameState {
  currentScriptId: string | null;
  selectedCharacterIds: string[];
  messages: ChatMessage[];
  isPlaying: boolean;
  startTime: number | null;
}

// 页面类型
export type PageType = 
  | 'chat' 
  | 'characters' 
  | 'scripts' 
  | 'saves' 
  | 'ai-rules' 
  | 'settings' 
  | 'help';
