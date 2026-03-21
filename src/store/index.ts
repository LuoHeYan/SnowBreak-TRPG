import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, SaveSlot, PlayerSettings, GameState, PageType } from '../types';

interface AppState {
  // 当前页面
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;

  // 玩家设置
  playerSettings: PlayerSettings;
  updatePlayerSettings: (settings: Partial<PlayerSettings>) => void;

  // 游戏状态
  gameState: GameState;
  startGame: (scriptId: string, characterIds: string[]) => void;
  endGame: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  deleteMessagesAfter: (messageId: string) => void;
  clearMessages: () => void;

  // 存档
  saveSlots: SaveSlot[];
  saveGame: (slotId: number) => void;
  loadGame: (slotId: number) => void;
  deleteSave: (slotId: number) => void;

  // 侧边栏
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const initialGameState: GameState = {
  currentScriptId: null,
  selectedCharacterIds: [],
  messages: [],
  isPlaying: false,
  startTime: null,
};

const initialPlayerSettings: PlayerSettings = {
  name: '分析员',
  // API 配置
  apiKey: '',
  apiProvider: 'openai',
  apiModel: 'gpt-4o',
  // AI 参数（默认中间值或开启）
  contextLength: 502047, // 中间值
  temperature: 1, // 中间值
  enableStreaming: true,
  // 游戏设置
  useScriptBackground: true,
  autoScroll: true,
  // Token 优化（默认开启）
  compressPrompt: false,        // 默认使用完整提示词
  maxHistoryMessages: 20,       // 默认保留20条历史消息
};

// 创建5个空存档槽
const createEmptySaveSlots = (): SaveSlot[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `存档 ${i + 1}`,
    scriptId: '',
    scriptName: '',
    selectedCharacters: [],
    messages: [],
    savedAt: 0,
    playTime: 0,
  }));
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 当前页面
      currentPage: 'chat',
      setCurrentPage: (page) => set({ currentPage: page }),

      // 玩家设置
      playerSettings: initialPlayerSettings,
      updatePlayerSettings: (settings) =>
        set((state) => ({
          playerSettings: { ...state.playerSettings, ...settings },
        })),

      // 游戏状态
      gameState: initialGameState,
      startGame: (scriptId, characterIds) =>
        set({
          gameState: {
            currentScriptId: scriptId,
            selectedCharacterIds: characterIds,
            messages: [],
            isPlaying: true,
            startTime: Date.now(),
          },
        }),
      endGame: () =>
        set({
          gameState: initialGameState,
        }),
      addMessage: (message) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            messages: [
              ...state.gameState.messages,
              {
                ...message,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
              },
            ],
          },
        })),
      clearMessages: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            messages: [],
          },
        })),
      updateMessage: (messageId, content) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            messages: state.gameState.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content } : msg
            ),
          },
        })),
      deleteMessage: (messageId) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            messages: state.gameState.messages.filter((msg) => msg.id !== messageId),
          },
        })),
      deleteMessagesAfter: (messageId) =>
        set((state) => {
          const index = state.gameState.messages.findIndex((msg) => msg.id === messageId);
          if (index === -1) return state;
          return {
            gameState: {
              ...state.gameState,
              messages: state.gameState.messages.slice(0, index),
            },
          };
        }),

      // 存档
      saveSlots: createEmptySaveSlots(),
      saveGame: (slotId) => {
        const state = get();
        const { gameState } = state;
        
        if (!gameState.currentScriptId) return;
        
        const playTime = gameState.startTime
          ? Math.floor((Date.now() - gameState.startTime) / 1000)
          : 0;

        set((state) => ({
          saveSlots: state.saveSlots.map((slot) =>
            slot.id === slotId
              ? {
                  ...slot,
                  scriptId: gameState.currentScriptId!,
                  scriptName: gameState.currentScriptId!, // 之后会从 scripts 获取名称
                  selectedCharacters: gameState.selectedCharacterIds,
                  messages: gameState.messages,
                  savedAt: Date.now(),
                  playTime: slot.playTime + playTime,
                }
              : slot
          ),
        }));
      },
      loadGame: (slotId) => {
        const state = get();
        const slot = state.saveSlots.find((s) => s.id === slotId);
        
        if (!slot || !slot.scriptId) return;

        set({
          gameState: {
            currentScriptId: slot.scriptId,
            selectedCharacterIds: slot.selectedCharacters,
            messages: slot.messages,
            isPlaying: true,
            startTime: Date.now(),
          },
          currentPage: 'chat',
        });
      },
      deleteSave: (slotId) =>
        set((state) => ({
          saveSlots: state.saveSlots.map((slot) =>
            slot.id === slotId
              ? {
                  id: slotId,
                  name: `存档 ${slotId}`,
                  scriptId: '',
                  scriptName: '',
                  selectedCharacters: [],
                  messages: [],
                  savedAt: 0,
                  playTime: 0,
                }
              : slot
          ),
        })),

      // 侧边栏
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'trpg-storage',
      partialize: (state) => ({
        playerSettings: state.playerSettings,
        saveSlots: state.saveSlots,
        gameState: state.gameState,
      }),
    }
  )
);

// 导出别名
export const useGameStore = useAppStore;
