import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Play, Save, Settings, MessageSquare, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '如何开始游戏？',
    answer: '首先在「设置」中配置你的 API Key，然后前往「剧本选择」选择一个剧本，点击「开始游戏」即可。',
  },
  {
    question: '需要自己提供 API Key 吗？',
    answer: '是的，本游戏需要使用 AI 来生成对话和剧情，你需要在「设置」中填入你自己的 OpenAI 或 Claude API Key。',
  },
  {
    question: '游戏进度会自动保存吗？',
    answer: '游戏不会自动保存，你需要在「存档管理」中手动保存进度。共有 5 个存档槽位可用。',
  },
  {
    question: '可以修改角色或剧本内容吗？',
    answer: '为保证游戏体验和内容安全，角色与剧本内容为只读状态，玩家无法修改。',
  },
  {
    question: '如何导入新剧本？',
    answer: '在「剧本选择」页面点击「导入剧本」，选择 JSON 格式的剧本文件即可导入。',
  },
  {
    question: 'AI 回复出现问题怎么办？',
    answer: '请检查 API Key 是否正确，以及网络连接是否正常。可以在「设置」中点击「测试连接」来检查。',
  },
];

const steps = [
  { icon: Settings, title: '配置设置', desc: '填写玩家名称和 API Key' },
  { icon: BookOpen, title: '选择剧本', desc: '挑选感兴趣的剧本' },
  { icon: Play, title: '开始游戏', desc: '进入聊天界面' },
  { icon: MessageSquare, title: '互动体验', desc: '与角色们展开对话' },
  { icon: Save, title: '保存进度', desc: '随时保存游戏进度' },
];

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">帮助说明</h2>
        <p className="text-sm text-slate-500 mt-1">了解如何使用本游戏</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* 快速开始 */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-indigo-500" />
            快速开始
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative p-4 rounded-xl bg-white border border-slate-200 text-center"
                >
                  {/* 步骤数字 */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-medium flex items-center justify-center shadow">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h4 className="font-medium text-slate-800 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 功能说明 */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4">功能说明</h3>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div>
              <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                <span className="text-indigo-500">◈</span> 聊天
              </h4>
              <p className="text-slate-600 text-sm pl-5">主游戏界面，在这里与 AI 扮演的角色们进行互动。</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                <span className="text-indigo-500">◈</span> 角色图鉴
              </h4>
              <p className="text-slate-600 text-sm pl-5">查看所有角色的详细信息，包括立绘、性格、表情差分等。</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                <span className="text-indigo-500">◈</span> 剧本选择
              </h4>
              <p className="text-slate-600 text-sm pl-5">浏览和选择剧本，查看剧本详情、世界书设定和参与角色。</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                <span className="text-indigo-500">◈</span> 存档管理
              </h4>
              <p className="text-slate-600 text-sm pl-5">管理游戏存档，支持保存和读取 5 个存档槽位。</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                <span className="text-indigo-500">◈</span> AI 规则
              </h4>
              <p className="text-slate-600 text-sm pl-5">查看游戏内置的 AI 行为规则，确保内容安全。</p>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-4">常见问题</h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-medium text-slate-800">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp size={20} className="text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4 bg-white">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 关于 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
          <h3 className="font-medium text-slate-800 mb-2">关于本游戏</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            本游戏是基于《尘白禁区》的二创跑团作品，所有角色和设定归原作所有。
            游戏采用 AI 技术驱动，为玩家提供沉浸式的互动体验。
          </p>
          <p className="text-slate-500 text-xs mt-3">
            本作品仅供娱乐，请遵守社区规范。
          </p>
        </div>
      </div>
    </div>
  );
}
