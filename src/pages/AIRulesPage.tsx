import { aiRulesConfig } from '../data/aiRules';
import { Shield, AlertTriangle, Check } from 'lucide-react';

export default function AIRulesPage() {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">AI 规则</h2>
        <p className="text-sm text-slate-500 mt-1">以下规则用于保证游戏体验和内容安全</p>
      </div>

      {/* 规则列表 */}
      <div className="space-y-4 mb-8">
        {aiRulesConfig.rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* 图标 */}
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                ${rule.enabled 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-slate-100 text-slate-400'
                }
              `}>
                <Shield size={20} />
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-slate-800">{rule.name}</h3>
                  {rule.enabled && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-xs">
                      <Check size={12} />
                      已启用
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm">{rule.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 敏感词列表 */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-medium text-slate-800">敏感词过滤</h3>
            <p className="text-sm text-slate-500">以下词汇将被系统过滤</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {aiRulesConfig.bannedPatterns.map((pattern, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
            >
              {pattern}
            </span>
          ))}
        </div>
      </div>

      {/* 说明 */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-slate-500 text-sm">
          ◈ 这些规则由游戏管理员设定，用于确保游戏内容符合社区规范。规则无法由玩家修改。
        </p>
      </div>
    </div>
  );
}
