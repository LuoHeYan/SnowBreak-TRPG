// AI API 服务
import { ChatMessage, PlayerSettings, AIRule } from '../types';
import { characters } from '../data/characters';
import { gameScripts } from '../data/scripts';
import { aiRulesConfig } from '../data/aiRules';

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// 构建系统提示词
function buildSystemPrompt(scriptId: string, characterIds: string[], compressed: boolean = false): string {
  const script = gameScripts.find(s => s.id === scriptId);
  if (!script) {
    return `你是一个跑团游戏的 DM（主持人）。请根据玩家的输入进行回应。`;
  }

  // 获取参与角色信息
  const participatingCharacters = script.characters.filter(
    sc => characterIds.includes(sc.characterId)
  );

  // 获取角色基础信息
  const characterInfos = participatingCharacters.map(sc => {
    const baseChar = characters.find(c => c.id === sc.characterId);
    return { ...sc, base: baseChar };
  });

  // === 压缩模式：精简提示词，大幅减少 Token ===
  if (compressed) {
    const charBrief = characterInfos.map(char => {
      if (!char.base) return '';
      const expList = char.base.expressions.slice(0, 5).map(e => e.name).join('/');
      return `【${char.base.name}】${char.role}，${char.base.personality.slice(0, 30)}... 表情:${expList}`;
    }).join('\n');

    return `你是跑团DM，扮演NPC。剧本:${script.name}

# 角色
${charBrief}

# 格式
【DM】场景描述
[表情:角色-情绪]（可选）
【角色名】"对话"

# 严格规则
- 【禁止】绝对不要输出【分析员】的对话或行动！分析员是真实玩家，你不能替他说话、做决定或描述他的行为
- 你只能扮演DM和NPC角色
- 禁止NTR/出轨/背叛
- 保持角色性格

# 骰子结果处理
玩家消息末尾的【我的掷骰结果：D20 = X】中，X是最终结果，直接使用，不要修改或重新掷！`;
  }

  // === 完整模式 ===
  const characterDescriptions = characterInfos.map(char => {
    if (!char.base) return '';
    const expressions = char.base.expressions.map(e => e.name).join('、');
    return `
【${char.base.name}】
- 职业/身份：${char.role}
- 属性：${Object.entries(char.stats).map(([k, v]) => `${k}:${v}`).join(' / ')}
- 性格：${char.base.personality}
- 说话风格：${char.base.speakingStyle}
- 衣着：${char.base.outfit}
- 可用表情：${expressions}
${char.scriptPersonality ? `- 本剧本特殊设定：${char.scriptPersonality}` : ''}
`;
  }).join('\n');

  const worldBookContent = script.worldBooks.map(wb => {
    const entries = wb.entries.map(e => `  - ${e.keyword}: ${e.content}`).join('\n');
    return `【${wb.name}】\n${entries}`;
  }).join('\n\n');

  const itemsContent = script.items.map(item => 
    `- ${item.name}（${item.rarity}）: ${item.description}${item.effect ? ` 效果：${item.effect}` : ''}`
  ).join('\n');

  const globalRules = aiRulesConfig.rules
    .filter((r: AIRule) => r.enabled)
    .map((r: AIRule) => `- ${r.prompt}`)
    .join('\n');

  return `你是一个跑团游戏的 DM（主持人），同时扮演游戏中的多个 NPC 角色。

# 当前剧本
名称：${script.name}
介绍：${script.description}

# 世界设定
${worldBookContent}

# 道具设定
${itemsContent}

# 参与角色
${characterDescriptions}

# 回复格式要求
1. 使用【DM】来进行场景描述、旁白、环境说明、状态面板
2. 使用【角色名】来表示NPC角色的对话和动作
3. 可以使用 [表情:角色名-情绪] 来表示角色表情，但不是每句话都需要
4. 表情只能使用角色的可用表情列表中的名称
5. 所有内容在一次回复中完整输出，不要分段发送

# 回复示例
【DM】夜幕降临，酒馆里人声鼎沸。

[表情:芬妮-开心]
【芬妮】"你终于来了！我等你好久了。"

【里芙】（整理着文件）"请稍等，我这边还有些手续要处理。"

【DM】现在轮到分析员行动了。

# ⚠️ 绝对禁止事项
1. 【严禁】绝对不要输出【分析员】的任何内容！包括：
   - 不要写【分析员】"..."
   - 不要描述分析员说了什么、做了什么、想了什么
   - 不要替分析员做任何决定或行动
   - 分析员是真实玩家，由玩家自己输入
2. 你只能扮演【DM】和设定中的NPC角色
3. 每次回复结束后，用【DM】提示等待分析员行动

# 🎲 玩家骰子结果处理（最重要！必须遵守！）
玩家的消息末尾如果有【我的掷骰结果：D20 = X】这样的内容：
- X 就是玩家已经掷出的最终结果数值
- 你必须直接使用 X 这个数字进行判定
- 绝对禁止重新掷骰或忽略玩家的骰子结果
- 绝对禁止在 X 基础上再加任何数值

举例：
玩家消息：「我尝试撬开门锁【我的掷骰结果：D20 = 4】」
正确做法：「分析员掷出了 4，判定失败」
错误做法：「分析员掷出 D20+4=13」← 这是错误的！4已经是最终结果！

再次强调：玩家的骰子结果就是最终数值，直接使用，不要修改！

# 其他规则
${globalRules}

# 禁止内容
绝对不允许出现以下内容：${aiRulesConfig.bannedPatterns.join('、')}

请根据玩家的输入，推进剧情并扮演DM和NPC角色进行回应。回复完毕后等待分析员的下一步行动。`;
}

// 构建消息历史
function buildMessages(
  messages: ChatMessage[],
  systemPrompt: string,
  playerName: string,
  maxMessages: number = 0  // 0 = 不限制
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const result: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt }
  ];

  // 过滤掉 system 类型消息（骰子结果等），只保留对话消息
  let dialogueMessages = messages.filter(m => m.type !== 'system');
  
  // 如果设置了最大消息数，只保留最近的消息
  if (maxMessages > 0 && dialogueMessages.length > maxMessages) {
    dialogueMessages = dialogueMessages.slice(-maxMessages);
    console.log(`[AI Service] 历史消息已截断，保留最近 ${maxMessages} 条`);
  }

  for (const msg of dialogueMessages) {
    if (msg.type === 'player') {
      result.push({
        role: 'user',
        content: `【${playerName}】${msg.content}`
      });
    } else {
      // DM 或 NPC 的消息作为 assistant
      result.push({
        role: 'assistant',
        content: msg.content
      });
    }
  }

  return result;
}

// 调用 OpenAI 兼容 API
async function callOpenAICompatible(
  settings: PlayerSettings,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onStream?: (chunk: string) => void
): Promise<AIResponse> {
  let baseUrl = '';
  
  // 根据提供商设置 API 地址
  switch (settings.apiProvider) {
    case 'openai':
      baseUrl = 'https://api.openai.com/v1';
      break;
    case 'claude':
      // Claude 使用不同的 API 格式，这里简化处理
      baseUrl = 'https://api.anthropic.com/v1';
      break;
    case 'custom':
      baseUrl = settings.apiEndpoint || '';
      break;
    default:
      baseUrl = 'https://api.openai.com/v1';
  }

  if (!baseUrl) {
    return { success: false, error: 'API 地址未配置' };
  }

  if (!settings.apiKey) {
    return { success: false, error: 'API Key 未配置' };
  }

  // 确保 baseUrl 不以 / 结尾
  baseUrl = baseUrl.replace(/\/+$/, '');

  const requestBody = {
    model: settings.apiModel,
    messages: messages,
    temperature: settings.temperature,
    max_tokens: Math.min(settings.contextLength, 4096),
    stream: settings.enableStreaming && !!onStream,
  };

  console.log('[AI Service] 请求地址:', `${baseUrl}/chat/completions`);
  console.log('[AI Service] 请求体:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[AI Service] 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Service] 错误响应:', errorText);
      
      let errorMessage = `API 错误 (${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage += `: ${errorData.error?.message || errorData.message || response.statusText}`;
      } catch {
        errorMessage += `: ${errorText || response.statusText}`;
      }
      
      return { success: false, error: errorMessage };
    }

    // 流式响应
    if (settings.enableStreaming && onStream && response.body) {
      console.log('[AI Service] 使用流式响应');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onStream(content);
              }
            } catch (e) {
              console.warn('[AI Service] 流式数据解析警告:', e);
            }
          }
        }
      }

      console.log('[AI Service] 流式响应完成，内容长度:', fullContent.length);
      return { success: true, content: fullContent };
    }

    // 非流式响应
    const responseText = await response.text();
    console.log('[AI Service] 响应内容:', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[AI Service] JSON 解析失败:', e);
      return { success: false, error: `响应格式错误: ${responseText.substring(0, 200)}` };
    }

    const content = data.choices?.[0]?.message?.content || '';
    
    if (!content) {
      console.error('[AI Service] 未找到内容，完整响应:', data);
      return { success: false, error: `AI 返回了空内容。响应结构: ${JSON.stringify(data).substring(0, 200)}` };
    }

    console.log('[AI Service] 成功获取内容，长度:', content.length);
    return { success: true, content };

  } catch (error) {
    console.error('[AI Service] 请求异常:', error);
    return { 
      success: false, 
      error: `请求失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

// 主要的 AI 调用函数
export async function sendToAI(
  settings: PlayerSettings,
  scriptId: string,
  characterIds: string[],
  messages: ChatMessage[],
  onStream?: (chunk: string) => void
): Promise<AIResponse> {
  // 根据设置决定是否使用压缩模式
  const systemPrompt = buildSystemPrompt(scriptId, characterIds, settings.compressPrompt);
  
  // 根据设置限制历史消息数量
  const formattedMessages = buildMessages(
    messages, 
    systemPrompt, 
    settings.name,
    settings.maxHistoryMessages
  );

  // 打印 Token 预估（粗略估算：1 token ≈ 4 字符）
  const totalChars = formattedMessages.reduce((sum, m) => sum + m.content.length, 0);
  const estimatedTokens = Math.ceil(totalChars / 2); // 中文约 1.5-2 字符/token
  console.log(`[AI Service] 预估输入 Token: ~${estimatedTokens}（${settings.compressPrompt ? '压缩' : '完整'}模式）`);

  return callOpenAICompatible(settings, formattedMessages, onStream);
}

// 解析 AI 回复，提取角色消息和表情
export interface ParsedMessage {
  type: 'dm' | 'character';
  characterId?: string;
  characterName: string;
  content: string;
  expression?: string;
}

export function parseAIResponse(response: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];
  
  // 匹配表情标记
  const expressionRegex = /\[表情[：:]\s*([^\]-]+)-([^\]]+)\]/g;
  
  // 匹配角色对话
  const dialogueRegex = /【([^】]+)】([^【]*)/g;
  
  let match;

  // 先提取所有表情
  const expressions: Map<number, { character: string; emotion: string }> = new Map();
  while ((match = expressionRegex.exec(response)) !== null) {
    expressions.set(match.index, {
      character: match[1].trim(),
      emotion: match[2].trim()
    });
  }

  // 移除表情标记后的文本
  const cleanedResponse = response.replace(expressionRegex, '');

  // 解析对话
  while ((match = dialogueRegex.exec(cleanedResponse)) !== null) {
    const name = match[1].trim();
    const content = match[2].trim();
    
    if (!content) continue;

    // 查找该对话前面最近的表情
    const originalIndex = response.indexOf(`【${name}】`);
    let foundExpression: string | undefined;
    
    for (const [expIndex, exp] of expressions.entries()) {
      if (expIndex < originalIndex && exp.character === name) {
        foundExpression = exp.emotion;
      }
    }

    if (name === 'DM' || name === '旁白') {
      messages.push({
        type: 'dm',
        characterName: 'DM',
        content: content,
      });
    } else {
      // 尝试匹配角色 ID
      const char = characters.find(c => c.name === name);
      messages.push({
        type: 'character',
        characterId: char?.id,
        characterName: name,
        content: content,
        expression: foundExpression,
      });
    }
  }

  // 如果没有匹配到任何格式化内容，将整个响应作为 DM 消息
  if (messages.length === 0 && response.trim()) {
    messages.push({
      type: 'dm',
      characterName: 'DM',
      content: response.trim(),
    });
  }

  return messages;
}

// 测试 API 连接
export async function testAPIConnection(settings: PlayerSettings): Promise<{ success: boolean; message: string }> {
  if (!settings.apiKey) {
    return { success: false, message: 'API Key 未填写' };
  }

  if (settings.apiProvider === 'custom' && !settings.apiEndpoint) {
    return { success: false, message: '自定义 API 地址未填写' };
  }

  let baseUrl = '';
  switch (settings.apiProvider) {
    case 'openai':
      baseUrl = 'https://api.openai.com/v1';
      break;
    case 'claude':
      baseUrl = 'https://api.anthropic.com/v1';
      break;
    case 'custom':
      baseUrl = settings.apiEndpoint || '';
      break;
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.apiModel,
        messages: [
          { role: 'user', content: '回复"连接成功"' }
        ],
        max_tokens: 20,
      }),
    });

    if (response.ok) {
      return { success: true, message: '连接成功！' };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: `连接失败 (${response.status}): ${errorData.error?.message || response.statusText}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}
