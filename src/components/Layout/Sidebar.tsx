import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  Save, 
  Shield, 
  Settings, 
  HelpCircle,
  X 
} from 'lucide-react';
import { PageType } from '../../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: { id: PageType; label: string; icon: typeof MessageSquare }[] = [
  { id: 'chat', label: '聊天', icon: MessageSquare },
  { id: 'characters', label: '角色图鉴', icon: Users },
  { id: 'scripts', label: '剧本选择', icon: BookOpen },
  { id: 'saves', label: '存档管理', icon: Save },
  { id: 'ai-rules', label: 'AI 规则', icon: Shield },
  { id: 'settings', label: '设置', icon: Settings },
  { id: 'help', label: '帮助', icon: HelpCircle },
];

export default function Sidebar({ currentPage, onPageChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 lg:w-56
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          bg-white/70 backdrop-blur-xl
          border-r border-slate-200/60
          shadow-xl shadow-slate-200/20 lg:shadow-none
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white text-sm font-bold">◈</span>
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">跑团游戏</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 菜单 */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 text-left
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="p-4 border-t border-slate-200/60">
          <div className="text-xs text-slate-400 text-center">
            尘白禁区 · 二创跑团
          </div>
        </div>
      </aside>
    </>
  );
}
