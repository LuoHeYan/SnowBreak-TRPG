import { useAppStore } from '../store';
import { gameScripts } from '../data/scripts';
import { Save, Trash2, Upload, Clock, MessageSquare } from 'lucide-react';

export default function SavesPage() {
  const { saveSlots, saveGame, loadGame, deleteSave, gameState } = useAppStore();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const getScriptName = (scriptId: string) => {
    return gameScripts.find(s => s.id === scriptId)?.name || '未知剧本';
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">存档管理</h2>
        <p className="text-sm text-slate-500 mt-1">共 5 个存档槽位</p>
      </div>

      {/* 存档列表 */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((slotId) => {
          const slot = saveSlots.find(s => s.id === slotId);
          const isEmpty = !slot;

          return (
            <div
              key={slotId}
              className={`
                p-5 rounded-2xl border transition-all
                ${isEmpty 
                  ? 'bg-slate-50 border-slate-200 border-dashed' 
                  : 'bg-white border-slate-200 shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                {/* 左侧信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium">
                      {slotId}
                    </span>
                    <span className="font-medium text-slate-800">
                      {isEmpty ? '空存档' : slot.name || `存档 ${slotId}`}
                    </span>
                  </div>

                  {slot && (
                    <div className="pl-11 space-y-1.5">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Save size={14} />
                          <span>{getScriptName(slot.scriptId)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{formatTime(slot.savedAt)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare size={14} />
                          <span>{slot.messages.length} 条消息</span>
                        </span>
                        <span>游玩 {formatPlayTime(slot.playTime)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 右侧按钮 */}
                <div className="flex items-center gap-2">
                  {gameState.isPlaying && (
                    <button
                      onClick={() => saveGame(slotId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
                    >
                      <Save size={16} />
                      <span className="hidden sm:inline">保存</span>
                    </button>
                  )}
                  
                  {slot && (
                    <>
                      <button
                        onClick={() => {
                          if (confirm('确定要读取此存档吗？当前进度将丢失。')) {
                            loadGame(slotId);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors"
                      >
                        <Upload size={16} />
                        <span className="hidden sm:inline">读取</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除此存档吗？')) {
                            deleteSave(slotId);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">删除</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 提示 */}
      {!gameState.isPlaying && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-amber-700 text-sm">
            ◈ 提示：开始游戏后才能保存进度
          </p>
        </div>
      )}
    </div>
  );
}
