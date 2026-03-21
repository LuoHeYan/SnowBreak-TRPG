import { Menu, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { gameState } = useAppStore();

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white/50 backdrop-blur-lg border-b border-slate-200/60">
      {/* 左侧 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      </div>

      {/* 右侧状态 */}
      {gameState.isPlaying && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <Sparkles size={14} className="text-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">游戏中</span>
        </div>
      )}
    </header>
  );
}
