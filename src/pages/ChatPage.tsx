import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { characters } from '../data/characters';
import { getAllScripts } from '../data/scripts';
import { sendToAI } from '../services/ai';
import { Send, Sparkles, BookOpen, Loader2, AlertCircle, StopCircle, Dices, ChevronUp, ChevronDown, Trash2, RefreshCw, Copy, Check, MoreHorizontal } from 'lucide-react';

// 掷骰子工具函数
const rollDice = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

// 解析骰子表达式 (如 2D6+3, 1D20, 3D8-2)
const parseDiceExpression = (expression: string): { result: number; details: string } | null => {
  const regex = /^(\d*)D(\d+)([+-]\d+)?$/i;
  const match = expression.trim().toUpperCase().match(regex);
  
  if (!match) return null;
  
  const count = parseInt(match[1] || '1');
  const sides = parseInt(match[2]);
  const modifier = parseInt(match[3] || '0');
  
  if (count < 1 || count > 100 || sides < 2 || sides > 1000) return null;
  
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDice(sides));
  }
  
  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + modifier;
  
  let details = '';
  if (count === 1) {
    details = `D${sides} = ${rolls[0]}`;
  } else {
    details = `${count}D${sides} [${rolls.join(', ')}] = ${sum}`;
  }
  
  if (modifier !== 0) {
    details += ` ${modifier > 0 ? '+' : ''}${modifier} = ${total}`;
  }
  
  return { result: total, details };
};

// COC 检定结果判定
const getCOCResult = (roll: number, skillValue: number): { type: string; color: string } => {
  if (roll === 1) return { type: '大成功', color: 'text-yellow-500' };
  if (roll === 100) return { type: '大失败', color: 'text-red-600' };
  if (roll <= skillValue / 5) return { type: '极难成功', color: 'text-green-600' };
  if (roll <= skillValue / 2) return { type: '困难成功', color: 'text-green-500' };
  if (roll <= skillValue) return { type: '成功', color: 'text-blue-500' };
  return { type: '失败', color: 'text-red-500' };
};

export default function ChatPage() {
  const { gameState, addMessage, deleteMessage, deleteMessagesAfter, playerSettings, setCurrentPage } = useAppStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [showDicePanel, setShowDicePanel] = useState(false);
  const [customDice, setCustomDice] = useState('');
  const [skillValue, setSkillValue] = useState(50);
  const [pendingDiceResult, setPendingDiceResult] = useState<string | null>(null); // 待发送的骰子结果
  const [copiedId, setCopiedId] = useState<string | null>(null); // 复制状态
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null); // 当前打开的菜单
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null); // 正在重新生成的消息
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 获取所有剧本（内置 + 导入的）
  const allScripts = getAllScripts();

  const currentScript = gameState.currentScriptId
    ? allScripts.find(s => s.id === gameState.currentScriptId)
    : null;

  // 自动滚动
  useEffect(() => {
    if (playerSettings.autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState.messages, streamingContent, playerSettings.autoScroll]);

  // 游戏开始时添加开场白
  useEffect(() => {
    if (gameState.isPlaying && gameState.messages.length === 0 && currentScript) {
      // 添加开场白作为 DM 消息
      addMessage({
        type: 'dm',
        content: currentScript.openingPrompt,
        characterId: 'dm',
        characterName: 'DM',
      });
    }
  }, [gameState.isPlaying, gameState.messages.length, currentScript]);

  // 掷骰子并添加到聊天
  const handleRoll = (expression: string) => {
    const result = parseDiceExpression(expression);
    if (!result) {
      setError('无效的骰子表达式');
      return;
    }

    // 保存骰子结果，等待玩家发送消息时附加
    setPendingDiceResult(result.details);

    addMessage({
      type: 'system',
      content: `🎲 ${playerSettings.name || '分析员'} 掷骰子：${result.details}`,
      characterId: 'system',
      characterName: '系统',
    });
  };

  // COC 技能检定
  const handleSkillCheck = () => {
    const roll = rollDice(100);
    const result = getCOCResult(roll, skillValue);
    
    const diceDetails = `D100 = ${roll} → ${result.type}`;
    // 保存骰子结果，等待玩家发送消息时附加
    setPendingDiceResult(diceDetails);
    
    addMessage({
      type: 'system',
      content: `🎲 ${playerSettings.name || '分析员'} 进行技能检定 (技能值 ${skillValue})：\n${diceDetails}`,
      characterId: 'system',
      characterName: '系统',
    });
  };

  // 快速骰子按钮
  const quickDice = [
    { label: 'D4', expression: '1D4' },
    { label: 'D6', expression: '1D6' },
    { label: 'D8', expression: '1D8' },
    { label: 'D10', expression: '1D10' },
    { label: 'D12', expression: '1D12' },
    { label: 'D20', expression: '1D20' },
    { label: 'D100', expression: '1D100' },
  ];

  // 处理消息内容，为双引号中的文本应用颜色
  const processMessageContent = (content: string, characterColor: string) => {
  // 使用正则表达式匹配双引号中的内容
    const regex = /"([^"]*)"/g;
    return content.replace(regex, (match, captured) => {
      return `<span style="color: ${characterColor}; font-weight: 500;">"${captured}"</span>`;
    });
};

  // 复制消息内容
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
    setActiveMenuId(null);
  };

  // 删除消息
  const handleDeleteMessage = (messageId: string) => {
    if (confirm('确定要删除这条消息吗？')) {
      deleteMessage(messageId);
    }
    setActiveMenuId(null);
  };

  // 重新生成 AI 回复
  const handleRegenerate = async (messageId: string) => {
    // 找到要重新生成的消息的索引
    const messageIndex = gameState.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const targetMessage = gameState.messages[messageIndex];
    
    // 只能重新生成 AI 消息（DM 或角色）
    if (targetMessage.type !== 'dm' && targetMessage.type !== 'character') {
      return;
    }

    // 找到这条 AI 消息之前的玩家消息
    let playerMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (gameState.messages[i].type === 'player') {
        playerMessageIndex = i;
        break;
      }
    }

    if (playerMessageIndex === -1) {
      setError('找不到对应的玩家消息');
      return;
    }

    // 检查 API 配置
    if (!playerSettings.apiKey) {
      setError('请先在设置中配置 API Key');
      return;
    }

    setActiveMenuId(null);
    setRegeneratingId(messageId);
    setIsLoading(true);
    setStreamingContent('');
    setError(null);

    try {
      // 删除当前 AI 消息及之后的所有消息
      deleteMessagesAfter(messageId);

      // 获取到玩家消息为止的历史
      const messagesUpToPlayer = gameState.messages.slice(0, playerMessageIndex + 1);

      const response = await sendToAI(
        playerSettings,
        gameState.currentScriptId || '',
        gameState.selectedCharacterIds,
        messagesUpToPlayer,
        playerSettings.enableStreaming 
          ? (chunk) => setStreamingContent(prev => prev + chunk)
          : undefined
      );

      if (response.success && response.content) {
        addMessage({
          type: 'dm',
          content: response.content,
          characterId: 'dm',
          characterName: 'DM',
        });
      } else {
        setError(response.error || '重新生成失败');
      }
    } catch (err) {
      console.error('[ChatPage] 重新生成异常:', err);
      setError('重新生成失败，请重试');
    } finally {
      setIsLoading(false);
      setStreamingContent('');
      setRegeneratingId(null);
    }
  };

  // 点击其他地方关闭菜单
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenuId]);

  const handleSend = async () => {
    if (!input.trim() || !gameState.isPlaying || isLoading) return;
    
    let userMessage = input.trim();
    setInput('');
    setError(null);

    // 如果有待处理的骰子结果，附加到消息中
    let messageWithDice = userMessage;
    if (pendingDiceResult) {
      messageWithDice = `${userMessage}\n\n【我的掷骰结果：${pendingDiceResult}】`;
      setPendingDiceResult(null); // 清除已使用的骰子结果
    }

    // 添加玩家消息（显示原始消息，不包含骰子标记）
    addMessage({
      type: 'player',
      content: userMessage,
      characterId: 'player',
      characterName: playerSettings.name || '分析员',
    });

    // 检查 API 配置
    if (!playerSettings.apiKey) {
      setError('请先在设置中配置 API Key');
      return;
    }

    setIsLoading(true);
    setStreamingContent('');

    try {
      // 获取当前所有消息（包括刚添加的玩家消息，带骰子结果）
      const currentMessages = [
        ...gameState.messages,
        {
          id: 'temp',
          type: 'player' as const,
          content: messageWithDice, // 发送给 AI 的消息包含骰子结果
          characterId: 'player',
          characterName: playerSettings.name || '分析员',
          timestamp: Date.now(),
        }
      ];

      const response = await sendToAI(
        playerSettings,
        gameState.currentScriptId || '',
        gameState.selectedCharacterIds,
        currentMessages,
        playerSettings.enableStreaming 
          ? (chunk) => setStreamingContent(prev => prev + chunk)
          : undefined
      );

      console.log('[ChatPage] AI 响应:', response);

      if (response.success && response.content) {
        // 将整个 AI 回复作为单条 DM 消息添加
        // 不再解析分割，保持完整性避免截断
        addMessage({
          type: 'dm',
          content: response.content,
          characterId: 'dm',
          characterName: 'DM',
        });
      } else {
        console.error('[ChatPage] AI 调用失败:', response.error);
        setError(response.error || 'AI 回复失败，请打开浏览器控制台查看详细日志');
      }
    } catch (err) {
      console.error('[ChatPage] 发生异常:', err);
      setError(err instanceof Error ? err.message : '发生未知错误');
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setStreamingContent('');
  };

  const getCharacterInfo = (characterId: string | undefined, characterName?: string) => {
    if (!characterId || characterId === 'player') {
      return { name: playerSettings.name || '分析员', avatar: null };
    }
    if (characterId === 'dm') {
      return { name: 'DM', avatar: null };
    }
    if (characterId === 'system') {
      return { name: '系统', avatar: null };
    }
    const char = characters.find(c => c.id === characterId);
    if (char) {
      return { name: char.name, avatar: char.avatar };
    }
    // 如果找不到角色但有名字，返回名字
    return { name: characterName || '未知', avatar: null };
  };

  const getExpressionImage = (characterId: string | undefined, expression: string | undefined) => {
    if (!characterId || !expression) return null;
    const char = characters.find(c => c.id === characterId);
    if (!char) return null;
    const exp = char.expressions.find(e => e.name === expression);
    return exp ? `/images/expressions/${exp.file}` : null;
  };

  // 获取角色颜色
  const getCharacterColor = (characterId: string | undefined) => {
    if (!characterId) return '#64748b'; // 默认颜色
    if (characterId === 'player') return 'rgb(99, 102, 241)'; // 玩家颜色
    if (characterId === 'dm') return 'rgb(245, 158, 11)'; // DM 颜色
    if (characterId === 'system') return '#64748b'; // 系统颜色
  
    const char = characters.find(c => c.id === characterId);
    return char?.color || '#64748b'; // 角色颜色或默认颜色
};
  // 未开始游戏
  if (!gameState.isPlaying) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            <BookOpen size={32} className="text-indigo-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">开始你的冒险</h2>
          <p className="text-slate-500 mb-6 leading-relaxed">
            请先在「剧本选择」中选择一个剧本，然后开始游戏。
          </p>
          <button
            onClick={() => setCurrentPage('scripts')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <BookOpen size={18} />
            <span>选择剧本</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* 背景图 */}
      {playerSettings.useScriptBackground && currentScript?.cover && (
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${currentScript.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* 当前剧本提示 */}
      <div className="relative z-10 px-4 py-2 bg-white/60 backdrop-blur-sm border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles size={14} className="text-indigo-500" />
          <span className="text-slate-500">当前剧本：</span>
          <span className="font-medium text-slate-700">{currentScript?.name}</span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {gameState.messages.map((message) => {
          const charInfo = getCharacterInfo(message.characterId, message.characterName);
          const isPlayer = message.type === 'player';
          const isDM = message.type === 'dm';
          const isSystem = message.type === 'system';
          const expressionImg = getExpressionImage(message.characterId, message.expression);

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isPlayer ? 'flex-row-reverse' : ''} ${isSystem ? 'justify-center' : ''}`}
            >
              {/* 系统消息 - 居中显示 */}
              {isSystem ? (
                <div className="max-w-[85%] px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/50">
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{message.content}</p>
                </div>
              ) : (
                <>
                  {/* 头像 */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isDM 
                      ? 'bg-gradient-to-br from-amber-100 to-orange-100' 
                      : isPlayer 
                        ? 'bg-gradient-to-br from-indigo-100 to-violet-100'
                        : 'bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden'
                  }`}>
                    {charInfo.avatar ? (
                      <img 
                        src={charInfo.avatar} 
                        alt={charInfo.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : isDM ? (
                      <span className="text-amber-600 text-sm font-medium">DM</span>
                    ) : isPlayer ? (
                      <span className="text-indigo-600 text-sm font-medium">
                        {(playerSettings.name || '分析员').charAt(0)}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-sm font-medium">
                        {charInfo.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* 消息内容 */}
                    <div className={`flex flex-col ${isDM ? 'max-w-[95%]' : 'max-w-[75%]'} ${isPlayer ? 'items-end' : 'items-start'}`}>
                     {/* 角色名 */}
                     <span className={`text-xs mb-1 px-1 ${
                       isDM ? 'text-amber-600' : isPlayer ? 'text-indigo-600' : ''
                     }`} style={{
   // 只为角色消息应用颜色
                         color: !isDM && !isPlayer ? getCharacterColor(message.characterId) : undefined
                       }}>
                       {charInfo.name}
                       {message.expression && (
                         <span className="ml-2 text-slate-400">({message.expression})</span>
                       )}
                     </span>

                     {/* 表情图片 */}
                     {expressionImg && (
                       <div className="mb-2">
                         <img 
                           src={expressionImg} 
                           alt={message.expression}
                           className="w-24 h-24 rounded-lg object-cover border border-slate-200"
                         />
                       </div>
                     )}

                     {/* 消息气泡 + 操作按钮 */}
                     <div className="group relative">
                       <div className={`px-4 py-3 rounded-2xl leading-relaxed ${
                         isDM 
                           ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-slate-700 border border-amber-200/50' 
                           : isPlayer 
                             ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
                             : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/60'
                       }`}>
                         <div className="whitespace-pre-wrap"
                         dangerouslySetInnerHTML={{
                          __html: !isDM && !isPlayer
                          ? processMessageContent(message.content, getCharacterColor(message.characterId))
                          : message.content
                         }} 
                         />
                         </div>
                       </div>



                       {/* 操作按钮 - 悬停时显示 */}
                       <div className={`absolute top-0 ${isPlayer ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                         {/* 更多选项按钮 */}
                         <div className="relative">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setActiveMenuId(activeMenuId === message.id ? null : message.id);
                             }}
                             className="p-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white transition-colors shadow-sm"
                             title="更多选项"
                           >
                             <MoreHorizontal size={14} />
                           </button>

                           {/* 下拉菜单 */}
                           {activeMenuId === message.id && (
                             <div 
                               className={`absolute top-full mt-1 ${isPlayer ? 'right-0' : 'left-0'} bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px] z-50`}
                               onClick={(e) => e.stopPropagation()}
                             >
                               {/* 复制 */}
                               <button
                                 onClick={() => handleCopyMessage(message.id, message.content)}
                                 className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 text-slate-600"
                               >
                                 {copiedId === message.id ? (
                                   <>
                                     <Check size={14} className="text-green-500" />
                                     <span className="text-green-500">已复制</span>
                                   </>
                                 ) : (
                                   <>
                                     <Copy size={14} />
                                     <span>复制</span>
                                   </>
                                 )}
                               </button>

                               {/* 重新生成 - 仅 AI 消息 */}
                               {(isDM || message.type === 'character') && (
                                 <button
                                   onClick={() => handleRegenerate(message.id)}
                                   disabled={isLoading}
                                   className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50"
                                 >
                                   <RefreshCw size={14} className={regeneratingId === message.id ? 'animate-spin' : ''} />
                                   <span>重新生成</span>
                                 </button>
                               )}

                               {/* 删除 */}
                               <button
                                 onClick={() => handleDeleteMessage(message.id)}
                                 className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50 text-red-500"
                               >
                                 <Trash2 size={14} />
                                 <span>删除</span>
                               </button>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   </div>
                </>
              )}
            </div>
          );
        })}

        {/* 流式输出显示 */}
        {streamingContent && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <span className="text-amber-600 text-sm font-medium">AI</span>
            </div>
            <div className="flex flex-col max-w-[75%]">
              <span className="text-xs text-amber-600 mb-1 px-1">AI 正在回复...</span>
              <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-slate-700 border border-amber-200/50">
                <p className="whitespace-pre-wrap">{streamingContent}</p>
              </div>
            </div>
          </div>
        )}

        {/* 加载指示器 */}
        {isLoading && !streamingContent && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <Loader2 size={18} className="text-amber-600 animate-spin" />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-slate-500">AI 正在思考...</span>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 - 包含骰子面板 */}
      <div className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-slate-200/60">
        {/* 骰子切换按钮栏 */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/40">
          <button
            onClick={() => setShowDicePanel(!showDicePanel)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
              showDicePanel 
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Dices size={14} />
            <span>骰子工具</span>
            {showDicePanel ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          
          {/* 快速骰子按钮 - 始终显示 */}
          <div className="flex items-center gap-1">
            {quickDice.slice(0, 4).map((dice) => (
              <button
                key={dice.expression}
                onClick={() => handleRoll(dice.expression)}
                className="px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600 transition-colors"
                title={`掷 ${dice.label}`}
              >
                {dice.label}
              </button>
            ))}
          </div>
        </div>

        {/* 骰子面板 - 展开的详细面板 */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDicePanel ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 space-y-4 bg-slate-50/80">
            {/* 全部快速骰子 */}
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                <Dices size={12} />
                快速掷骰
              </h4>
              <div className="flex flex-wrap gap-2">
                {quickDice.map((dice) => (
                  <button
                    key={dice.expression}
                    onClick={() => handleRoll(dice.expression)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:opacity-90 transition-opacity"
                  >
                    {dice.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义骰子 + COC检定 - 横向排列 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 自定义骰子 */}
              <div className="flex-1">
                <h4 className="text-xs font-medium text-slate-500 mb-2">自定义表达式</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDice}
                    onChange={(e) => setCustomDice(e.target.value)}
                    placeholder="如：2D6+3"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300"
                  />
                  <button
                    onClick={() => {
                      if (customDice.trim()) {
                        handleRoll(customDice);
                        setCustomDice('');
                      }
                    }}
                    disabled={!customDice.trim()}
                    className="px-3 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    掷骰
                  </button>
                </div>
              </div>

              {/* COC 技能检定 */}
              <div className="flex-1">
                <h4 className="text-xs font-medium text-slate-500 mb-2">COC 技能检定 (D100)</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">技能值:</span>
                  <input
                    type="number"
                    value={skillValue}
                    onChange={(e) => setSkillValue(Math.max(1, Math.min(100, parseInt(e.target.value) || 50)))}
                    min={1}
                    max={100}
                    className="w-14 px-2 py-1.5 text-sm text-center rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <button
                    onClick={handleSkillCheck}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                  >
                    检定
                  </button>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    (极难≤{Math.floor(skillValue / 5)} 困难≤{Math.floor(skillValue / 2)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 输入框 */}
        <div className="p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "AI 正在回复..." : "输入你的行动或对话..."}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isLoading ? (
            <button
              onClick={stopGeneration}
              className="px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <StopCircle size={20} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </div>
    </div>


  );
}
