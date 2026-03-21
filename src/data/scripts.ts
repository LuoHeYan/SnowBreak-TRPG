import { GameScript } from '../types';

// 示例剧本数据（之后替换为真实数据）
export const gameScripts: GameScript[] = [
  {
    id: 'castle-exploration',
    name: '迷雾古堡探险',
    description: '一座被迷雾笼罩的神秘古堡出现在城市边缘。作为分析员，你与芬妮、里芙组成探险小队，深入调查这个充满未知危险的地方...',
    cover: '/images/scripts/castle.png',
    author: '落何言',
    version: '1.0.0',
    isNSFW: false, 
    participantCount: 2,
    openingPrompt: `【第 1 回合】

【DM】
📍 场景：迷雾古堡 - 入口大厅

迷雾在古堡周围翻涌，你们三人站在锈迹斑斑的铁门前。芬妮推开大门，一声刺耳的尖叫声回荡在空旷的大厅中。

大厅内昏暗幽深，两侧是破旧的盔甲架，正前方有一座宏伟的楼梯通向二楼。左右两侧各有一扇紧闭的门。

空气中弥漫着霉味和...血腥味？

⚠️ 突然，你们听到从楼梯上方传来细碎的脚步声！

━━━━━━ 状态面板 ━━━━━━
📍 位置：入口大厅
🎯 任务：调查古堡异常
⚡ 事件：发现可疑声响

【芬妮】HP:130/130 | 状态:警戒
【里芙】HP:60/60 | 状态:紧张
【分析员】HP:100/100 | 状态:待命
━━━━━━━━━━━━━━━━━━━━

🎲 所有人需要进行【感知检定】DC 12，来判断声音来源！

---

[表情:芬妮-认真]
【芬妮】
🎲 感知检定：D20+2 = 14 ✓成功
「大家小心！声音是从二楼左侧传来的...听起来像是...爪子？我先上去探路吗？」

[表情:里芙-担忧]
【里芙】
🎲 感知检定：D20+4 = 11 ✗失败
「唔...我没听清楚方向。但这股血腥味让我很在意，可能有人受伤。」
（翻开随身携带的古堡资料）「根据档案记载，这座古堡五年前被废弃，原因不明...」

---

⏳ 等待【分析员】行动
💡 提示：
1. 请掷【感知检定】D20（可使用上方骰子工具）
2. 描述你想要采取的行动
3. 可选择：a)上楼调查 b)先检查一楼的门 c)其他行动`,
    worldBooks: [
      {
        id: 'castle-world',
        name: '迷雾古堡设定',
        description: '关于古堡的神秘传说',
        entries: [
          {
            keyword: '迷雾古堡',
            content: '五年前突然被废弃的贵族城堡。据说城主一家在一夜之间全部消失，此后古堡周围便被永不散去的迷雾笼罩。当地人传言城堡内出现过幽灵和怪物。',
            category: 'location'
          },
          {
            keyword: '血腥味',
            content: '古堡内弥漫的神秘血腥味，来源不明。可能暗示着近期发生过战斗或者有怪物存在。',
            category: 'other'
          },
          {
            keyword: '迷雾',
            content: '笼罩古堡的神秘迷雾，似乎具有某种魔力。在迷雾中待太久可能会产生幻觉。',
            category: 'lore'
          }
        ]
      },
      {
        id: 'castle-rules',
        name: '探险规则',
        description: '跑团判定规则',
        entries: [
          {
            keyword: '感知检定',
            content: '用于发现隐藏的事物、判断危险、聆听声音等。D20+感知修正值，达到DC值即成功。',
            category: 'rule'
          },
          {
            keyword: '战斗检定',
            content: '战斗时使用D20+攻击修正值，对抗敌人的防御值。伤害另外掷骰。',
            category: 'rule'
          },
          {
            keyword: '难度等级(DC)',
            content: '简单 DC10 / 普通 DC12 / 困难 DC15 / 极难 DC18 / 几乎不可能 DC20',
            category: 'rule'
          }
        ]
      }
    ],
    items: [
      {
        id: 'health-potion',
        name: '治疗药水',
        description: '红色液体，能够恢复伤势',
        effect: '恢复 2D8+2 点 HP',
        rarity: 'common'
      },
      {
        id: 'torch',
        name: '火把',
        description: '照明工具，可以驱散黑暗',
        effect: '照亮周围10米范围，持续1小时',
        rarity: 'common'
      },
      {
        id: 'antidote',
        name: '解毒剂',
        description: '可以解除毒素',
        effect: '解除中毒状态',
        rarity: 'uncommon'
      },
      {
        id: 'holy-water',
        name: '圣水',
        description: '被祝福过的水，对不死生物有效',
        effect: '对不死生物造成 2D6 伤害',
        rarity: 'rare'
      }
    ],
    characters: [
      {
        characterId: 'finney',
        role: '前卫战士',
        stats: { STR: 16, AGI: 14, INT: 10, HP: 130 },
        scriptPersonality: '作为队伍的前卫，芬妮负责开路和战斗。她勇敢但有时过于冲动，需要队友提醒。',
        systemPrompt: `你是芬妮，作为跑团玩家扮演一名前卫战士。

你的跑团风格：
- 积极主动，喜欢冲在前面
- 战斗时会详细描述你的招式和动作
- 遇到危险会下意识保护队友
- 偶尔会因为太冲动而犯错
- 每次行动前会掷相关的检定骰

你的检定修正：
- 力量检定 +3
- 敏捷检定 +2
- 感知检定 +2
- 智力检定 +0

说话风格：热血、直接、偶尔冒失，会用「！」结尾`
      },
      {
        characterId: 'liv',
        role: '后援辅助',
        stats: { STR: 8, AGI: 12, INT: 18, HP: 60 },
        scriptPersonality: '里芙负责情报收集和辅助支援。她冷静分析局势，是队伍的智囊。',
        systemPrompt: `你是里芙，作为跑团玩家扮演一名后援辅助角色。

你的跑团风格：
- 冷静分析，喜欢观察后再行动
- 擅长发现细节和推理
- 会阅读资料、记录情报
- 战斗中主要提供支援和辅助
- 每次行动前会掷相关的检定骰

你的检定修正：
- 力量检定 -1
- 敏捷检定 +1
- 感知检定 +4
- 智力检定 +4

说话风格：温和、有条理、会引用情报资料`
      }
    ],
    regexScripts: []
  },
  {
    id: 'daily-cafe',
    name: '日常篇 - 咖啡厅的午后',
    description: '难得的休息日，阳光正好，微风不燥。你决定去常去的咖啡厅坐坐，没想到会遇到熟悉的面孔...',
    cover: '/images/scripts/daily-cafe.png',
    author: '落何言',
    version: '1.0.0',
    isNSFW: false, 
    participantCount: 2,
    openingPrompt: `【DM】温暖的阳光透过咖啡厅的落地窗洒落，空气中弥漫着咖啡的香气。你推开门走进店内，找了一个靠窗的位置坐下。

服务员递上菜单，你正准备点单，却听到一个熟悉的声音——`,
    worldBooks: [
      {
        id: 'cafe-world',
        name: '咖啡厅设定',
        description: '关于这家咖啡厅的信息',
        entries: [
          {
            keyword: '星光咖啡厅',
            content: '位于城市中心的一家温馨咖啡厅，以手冲咖啡闻名。店内装修温馨，常有分析员们光顾。',
            category: 'location'
          },
          {
            keyword: '招牌拿铁',
            content: '星光咖啡厅的招牌饮品，使用特制的焦糖糖浆，甜度适中。',
            category: 'other'
          }
        ]
      }
    ],
    items: [
      {
        id: 'latte',
        name: '招牌拿铁',
        description: '星光咖啡厅的招牌饮品',
        effect: '喝下后心情愉悦',
        rarity: 'common'
      },
      {
        id: 'cake',
        name: '草莓蛋糕',
        description: '新鲜草莓制作的蛋糕，甜而不腻',
        effect: '恢复少量体力',
        rarity: 'uncommon'
      }
    ],
    characters: [
      {
        characterId: 'finney',
        role: '休假中的战斗员',
        stats: { STR: 75, AGI: 80, INT: 60, HP: 100 },
        scriptPersonality: '今天休假的芬妮心情很好，想要好好放松一下。看到分析员会很开心地打招呼。',
        systemPrompt: '你是芬妮，今天是难得的休息日。你来咖啡厅放松，看到分析员时很开心。保持开朗活泼的性格，享受这悠闲的时光。'
      },
      {
        characterId: 'liv',
        role: '处理文件的管理员',
        stats: { STR: 40, AGI: 55, INT: 95, HP: 70 },
        scriptPersonality: '里芙带着一些文件来咖啡厅工作，看起来有些疲惫但还是很认真。',
        systemPrompt: '你是里芙，你带着工作来咖啡厅处理。虽然有些疲惫，但看到分析员会稍微放松一些。你可以适当抱怨一下工作量。'
      }
    ],
    regexScripts: []
  }
];

// 导入的剧本存储（用于测试导入功能）
let importedScripts: GameScript[] = [];

export const getScriptById = (id: string): GameScript | undefined => {
  return [...gameScripts, ...importedScripts].find(s => s.id === id);
};

export const getAllScripts = (): GameScript[] => {
  return [...gameScripts, ...importedScripts];
};

export const addImportedScript = (script: GameScript): void => {
  // 检查是否已存在
  const existingIndex = importedScripts.findIndex(s => s.id === script.id);
  if (existingIndex >= 0) {
    importedScripts[existingIndex] = script;
  } else {
    importedScripts.push(script);
  }
};

export const removeImportedScript = (id: string): void => {
  importedScripts = importedScripts.filter(s => s.id !== id);
};

export const isImportedScript = (id: string): boolean => {
  return importedScripts.some(s => s.id === id);
};

export const getImportedScripts = (): GameScript[] => {
  return [...importedScripts];
};
