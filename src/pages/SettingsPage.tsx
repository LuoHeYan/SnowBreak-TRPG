import { useState } from 'react';
import { useAppStore } from '../store';
import { testAPIConnection } from '../services/ai';
import { User, Key, Cpu, Sliders, Wifi, WifiOff, Loader2 } from 'lucide-react';

const API_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'] },
  { id: 'custom', name: '自定义 API', models: [] },
];

export default function SettingsPage() {
  const { playerSettings, updatePlayerSettings } = useAppStore();
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [customModel, setCustomModel] = useState('');

  const currentProvider = API_PROVIDERS.find(p => p.id === playerSettings.apiProvider) || API_PROVIDERS[0];

  const handleTestConnection = async () => {
    if (!playerSettings.apiKey) {
      alert('请先填写 API Key');
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('idle');
    setConnectionMessage('');

    try {
      const result = await testAPIConnection(playerSettings);
      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage(result.message);
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.message);
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage(error instanceof Error ? error.message : '连接失败');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作无法撤销。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">设置</h2>
        <p className="text-sm text-slate-500 mt-1">配置游戏参数和 API 连接</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* 玩家信息 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <User size={20} />
            </div>
            <h3 className="font-medium text-slate-800">玩家信息</h3>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-2">玩家名称</label>
            <input
              type="text"
              value={playerSettings.name}
              onChange={(e) => updatePlayerSettings({ name: e.target.value })}
              placeholder="输入你的名称..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 outline-none transition-all text-slate-700 placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-400 mt-2">此名称将在游戏中作为「分析员」的称呼</p>
          </div>
        </div>

        {/* API 配置 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Key size={20} />
            </div>
            <h3 className="font-medium text-slate-800">API 配置</h3>
          </div>

          <div className="space-y-4">
            {/* 提供商 */}
            <div>
              <label className="block text-sm text-slate-600 mb-2">API 提供商</label>
              <div className="grid grid-cols-3 gap-2">
                {API_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => updatePlayerSettings({ 
                      apiProvider: provider.id as 'openai' | 'claude' | 'custom',
                      apiModel: provider.models[0] || ''
                    })}
                    className={`
                      px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${playerSettings.apiProvider === provider.id
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm text-slate-600 mb-2">API Key</label>
              <input
                type="password"
                value={playerSettings.apiKey}
                onChange={(e) => updatePlayerSettings({ apiKey: e.target.value })}
                placeholder="输入你的 API Key..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 outline-none transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* 自定义 API 地址 */}
            {playerSettings.apiProvider === 'custom' && (
              <div>
                <label className="block text-sm text-slate-600 mb-2">API 地址</label>
                <input
                  type="text"
                  value={playerSettings.apiEndpoint || ''}
                  onChange={(e) => updatePlayerSettings({ apiEndpoint: e.target.value })}
                  placeholder="https://api.example.com/v1"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>
            )}

            {/* 模型选择 */}
            <div>
              <label className="block text-sm text-slate-600 mb-2">模型</label>
              {currentProvider.models.length > 0 ? (
                <select
                  value={playerSettings.apiModel}
                  onChange={(e) => updatePlayerSettings({ apiModel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 outline-none transition-all text-slate-700"
                >
                  {currentProvider.models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customModel || playerSettings.apiModel}
                  onChange={(e) => {
                    setCustomModel(e.target.value);
                    updatePlayerSettings({ apiModel: e.target.value });
                  }}
                  placeholder="输入模型名称..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200/50 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                />
              )}
            </div>

            {/* 测试连接 */}
            <button
              onClick={handleTestConnection}
              disabled={testingConnection || !playerSettings.apiKey}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
                ${connectionStatus === 'success'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : connectionStatus === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {testingConnection ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>测试中...</span>
                </>
              ) : connectionStatus === 'success' ? (
                <>
                  <Wifi size={18} />
                  <span>连接成功</span>
                </>
              ) : connectionStatus === 'error' ? (
                <>
                  <WifiOff size={18} />
                  <span>连接失败</span>
                </>
              ) : (
                <>
                  <Wifi size={18} />
                  <span>测试连接</span>
                </>
              )}
            </button>
            
            {/* 连接状态详细信息 */}
            {connectionMessage && (
              <div className={`mt-2 text-sm p-3 rounded-lg ${
                connectionStatus === 'success' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {connectionMessage}
              </div>
            )}
          </div>
        </div>

        {/* AI 参数 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <h3 className="font-medium text-slate-800">AI 参数</h3>
          </div>

          <div className="space-y-5">
            {/* 上下文长度 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-600">上下文长度</label>
                <span className="text-sm font-medium text-indigo-600">
                  {playerSettings.contextLength >= 1000 
                    ? `${Math.round(playerSettings.contextLength / 1000)}K` 
                    : playerSettings.contextLength
                  }
                </span>
              </div>
              <input
                type="range"
                min="4096"
                max="999999"
                step="1000"
                value={playerSettings.contextLength}
                onChange={(e) => updatePlayerSettings({ contextLength: Number(e.target.value) })}
                className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>4K</span>
                <span>1M</span>
              </div>
            </div>

            {/* 温度 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-600">温度 (创造性)</label>
                <span className="text-sm font-medium text-indigo-600">{playerSettings.temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={playerSettings.temperature}
                onChange={(e) => updatePlayerSettings({ temperature: Number(e.target.value) })}
                className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>精确</span>
                <span>创造</span>
              </div>
            </div>

            {/* 流式传输 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-slate-700">流式传输</label>
                <p className="text-xs text-slate-400">实时显示 AI 回复</p>
              </div>
              <button
                onClick={() => updatePlayerSettings({ enableStreaming: !playerSettings.enableStreaming })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${playerSettings.enableStreaming ? 'bg-indigo-500' : 'bg-slate-300'}
                `}
              >
                <span className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                  ${playerSettings.enableStreaming ? 'left-7' : 'left-1'}
                `} />
              </button>
            </div>
          </div>
        </div>

        {/* 游戏设置 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sliders size={20} />
            </div>
            <h3 className="font-medium text-slate-800">游戏设置</h3>
          </div>

          <div className="space-y-4">
            {/* 使用剧本背景 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-slate-700">使用剧本背景</label>
                <p className="text-xs text-slate-400">在聊天界面显示剧本封面作为背景</p>
              </div>
              <button
                onClick={() => updatePlayerSettings({ useScriptBackground: !playerSettings.useScriptBackground })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${playerSettings.useScriptBackground ? 'bg-indigo-500' : 'bg-slate-300'}
                `}
              >
                <span className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                  ${playerSettings.useScriptBackground ? 'left-7' : 'left-1'}
                `} />
              </button>
            </div>

            {/* 自动滚动 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-slate-700">自动滚动</label>
                <p className="text-xs text-slate-400">新消息时自动滚动到底部</p>
              </div>
              <button
                onClick={() => updatePlayerSettings({ autoScroll: !playerSettings.autoScroll })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${playerSettings.autoScroll ? 'bg-indigo-500' : 'bg-slate-300'}
                `}
              >
                <span className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                  ${playerSettings.autoScroll ? 'left-7' : 'left-1'}
                `} />
              </button>
            </div>
          </div>
        </div>

        {/* Token 优化 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <span className="text-lg font-bold">◈</span>
            </div>
            <div>
              <h3 className="font-medium text-slate-800">Token 优化</h3>
              <p className="text-xs text-slate-400">减少 API 调用成本</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 压缩提示词 */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-slate-700">压缩提示词</label>
                <p className="text-xs text-slate-400">精简系统提示，可减少约 60% Token</p>
              </div>
              <button
                onClick={() => updatePlayerSettings({ compressPrompt: !playerSettings.compressPrompt })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${playerSettings.compressPrompt ? 'bg-indigo-500' : 'bg-slate-300'}
                `}
              >
                <span className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                  ${playerSettings.compressPrompt ? 'left-7' : 'left-1'}
                `} />
              </button>
            </div>

            {/* 历史消息数量 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-600">历史消息数量</label>
                <span className="text-sm font-medium text-indigo-600">
                  {playerSettings.maxHistoryMessages === 0 ? '不限' : `${playerSettings.maxHistoryMessages} 条`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={playerSettings.maxHistoryMessages}
                onChange={(e) => updatePlayerSettings({ maxHistoryMessages: Number(e.target.value) })}
                className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>不限</span>
                <span>50条</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                限制发送给 AI 的历史消息数量，可大幅减少 Token 消耗。对话过长时会自动截断早期内容。
              </p>
            </div>

            {/* Token 估算说明 */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-700">
                <strong>💡 省钱提示：</strong>
                <br />• 开启「压缩提示词」可减少约 60% 的系统提示 Token
                <br />• 设置「历史消息」为 10-20 条可避免对话过长
                <br />• 两者结合使用效果最佳
              </p>
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
          >
            清除所有数据
          </button>
          <p className="text-xs text-slate-400 text-center mt-2">
            此操作将清除所有设置、存档和导入的剧本
          </p>
        </div>
      </div>
    </div>
  );
}
