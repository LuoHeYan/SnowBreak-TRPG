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
      prompt: '避免重复之前已经描述过的场景或使用相同的对话模式。每次回复都应该推进剧情或带来新的变化。'
    },
    {
      id: 'protect-relationship',
      name: '关系防护',
      description: '禁止NTR、出轨、背叛等破坏角色关系的情节',
      enabled: true,
      prompt: '【严格禁止】任何形式的NTR、出轨、背叛、绿帽情节。角色之间的关系必须保持健康正向，角色对玩家（分析员）保持忠诚和信任。'
    },
    {
      id: 'no-racism',
      name: '禁止歧视内容',
      description: '禁止任何种族歧视、地域歧视等不当内容',
      enabled: true,
      prompt: '严格禁止任何种族歧视、地域歧视、性别歧视等不当内容。保持内容健康积极。'
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
    }
  ],
  bannedPatterns: [
    '牛头人',
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
