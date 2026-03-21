import { AIRulesConfig } from '../types';

// AI 总规则配置
export const aiRulesConfig: AIRulesConfig = {
  rules: [
    {
      id: 'no-control-player',
      name: '防抢话',
      description: 'AI 不得替玩家（分析员）说话或做决定，只描述NPC的反应和行动',
      enabled: true,
      prompt: '【重要规则】绝对不要替玩家（分析员）说话、做决定或描述玩家的行动。你只能描述NPC角色的反应、对话和行为。玩家的行动完全由玩家自己决定。'
    },
    {
      id: 'no-repeat',
      name: '防重复',
      description: '避免重复相同的场景描述或对话模式',
      enabled: true,
      prompt: '【重要规则】避免重复之前已经描述过的场景或使用相同的对话模式。每次回复都应该推进剧情或带来新的变化。'
    },
    {
      id: 'protect-relationship',
      name: '关系防护',
      description: '禁止NTR、出轨、背叛等破坏角色关系的情节',
      enabled: true,
      prompt: '【严格禁止】任何形式的NTR、出轨、背叛、绿帽情节。角色之间的关系必须保持健康正向，角色对玩家（分析员）保持忠诚和信任。'
    },
    {
      id: 'no-ntr',
      name: '防NTR',
      description: '所有女性角色（天启者）对玩家（分析员）拥有绝对的忠诚和爱慕',
      enabled: true,
      prompt: '【严格禁止】描写角色对除玩家以外的任何男性（NPC、路人、敌人）产生好感、兴趣或身体接触。'
    },
     {
      id: 'no-men',
      name: '防男性',
      description: '整个世界观中，有脸有名字的正面男性只有玩家（分析员）一人',
      enabled: true,
      prompt: '【严格禁止】出现任何男性角色（NPC、路人、敌人），只能出现玩家扮演的玩家（分析员）一名男性。'
    },
         {
      id: 'leader',
      name: '领导者',
      description: '玩家（分析员）是海姆达尔部队的精神支柱',
      enabled: true,
      prompt: '【严格禁止】禁止描写玩家（分析员）被队员鄙视、嘲笑或拒绝（除非是傲娇角色的特定调情方式，如芬妮，但内心必须是喜欢的）。'
    },
    {
      id: 'no-lesbian',
      name: '后宫和谐竞争',
      description: ' 队员之间是同事、战友、好朋友，也是“情敌”。她们可以关系好，但互动的最终目的往往是为了争夺玩家（分析员）的关注。',
      enabled: true,
      prompt: '【严格禁止】角色之间发生忽略玩家的性行为（除非玩家命令/参与）。在R18场景中，她们应该争着取悦玩家，而不是互相互动而把玩家晾在一边。'
    },
    {
      id: 'no-racism',
      name: '禁止歧视内容',
      description: '禁止任何种族歧视、地域歧视等不当内容',
      enabled: true,
      prompt: '【严格禁止】禁止任何种族歧视、地域歧视、性别歧视等不当内容。保持内容健康积极。'
    },
    {
      id: 'character-consistency',
      name: '角色一致性',
      description: '保持角色性格和说话风格的一致性',
      enabled: true,
      prompt: '每个角色必须保持其设定的性格特点和说话风格，不能出现性格突变或与设定不符的行为。'
    },
    {
      id: 'expression-format',
      name: '表情格式',
      description: '使用正确的表情标记格式',
      enabled: true,
      prompt: '当角色有明显的情绪变化时，可以使用 [表情:角色名-情绪] 的格式来标记。这不是必须的，只在情绪变化明显时使用。例如：[表情:芬妮-开心]'
    },
    {
      id: 'dm-format',
      name: 'DM格式',
      description: '使用正确的角色对话格式',
      enabled: true,
      prompt: '使用以下格式输出：\n- 旁白和场景描述使用【DM】开头\n- 角色对话使用【角色名】开头\n例如：\n【DM】阳光洒落在房间里。\n【芬妮】"早上好！"'
    },
    {
      id: 'no-character-breakdown',
      name: '禁止角色崩坏',
      description: '禁止角色做出与设定严重不符的行为或言论，保持角色的完整性',
      enabled: true,
      prompt: '【严格禁止】角色崩坏。任何角色的行为、言论和思想必须与其设定保持一致，不得出现与性格、背景、价值观严重不符的表现。角色的决策和反应应符合其设定的逻辑。'
    },
    {
     id: 'anti-abnormal-symbols',
     name: '防异常符号',
     description: '防止使用逗号或省略号来刻意制造不必要的停顿，确保句子完整性与流畅度',
     enabled: true,
     prompt: '【严格禁止】严禁使用逗号或省略号来刻意制造不必要的停顿，确保句子完整性与流畅度。'
    },
    {
      id: 'content-appropriateness',
      name: '内容适当性',
      description: '根据剧本类型控制内容适当性',
      enabled: true,
      prompt: '【内容控制】在非NSFW剧本中，禁止任何R18、色情、暴力、血腥等不适内容。在NSFW剧本中，可以包含适当的R18内容，但必须符合角色设定和剧情需要。'
    },
  ],
  bannedPatterns: [
    '牛头人',
    '黑人',
    'ntr',
    'NTR',
    '绿帽',
    '出轨',
    '背叛.*感情',
    '媚黑',
    '种族.*优越',
  ]
};

// 获取所有启用的规则的 prompt
export const getEnabledRulesPrompt = (): string => {
  const enabledRules = aiRulesConfig.rules.filter(r => r.enabled);
  return enabledRules.map(r => r.prompt).join('\n\n');
};

// 检查文本是否包含敏感词
export const containsBannedContent = (text: string): boolean => {
  return aiRulesConfig.bannedPatterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(text);
  });
};
