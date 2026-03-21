import { useState, useRef } from 'react';
import { GameScript } from '../types';
import { getAllScripts, addImportedScript, removeImportedScript, getImportedScripts } from '../data/scripts';
import { characters } from '../data/characters';
import { useAppStore } from '../store';
import Modal from '../components/Modal';
import { Upload, Trash2, Play, ChevronDown, ChevronUp, Download, BookOpen, Package, Users, FileText } from 'lucide-react';

type DetailTab = 'intro' | 'world' | 'items' | 'characters';

const rarityColors: Record<string, string> = {
  common: 'text-slate-600 bg-slate-100 border-slate-200',
  uncommon: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  rare: 'text-blue-600 bg-blue-50 border-blue-200',
  epic: 'text-purple-600 bg-purple-50 border-purple-200',
  legendary: 'text-amber-600 bg-amber-50 border-amber-200',
};

const rarityLabels: Record<string, string> = {
  common: '普通',
  uncommon: '优秀',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export default function ScriptsPage() {
  const { startGame, gameState, setCurrentPage } = useAppStore();
  const [scripts, setScripts] = useState<GameScript[]>(getAllScripts());
  const [selectedScript, setSelectedScript] = useState<GameScript | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('intro');
  const [expandedWorldBook, setExpandedWorldBook] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importedScriptIds = getImportedScripts().map(s => s.id);

  const refreshScripts = () => {
    setScripts(getAllScripts());
  };

  const handleStartGame = (script: GameScript) => {
    const characterIds = script.characters.map(c => c.characterId);
    startGame(script.id, characterIds);
    setSelectedScript(null);
    setCurrentPage('chat');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let scriptData: GameScript;

        if (file.name.endsWith('.json')) {
          scriptData = JSON.parse(content);
        } else if (file.name.endsWith('.png')) {
          // PNG 文件中的数据读取（简化处理）
          const base64Match = content.match(/data:application\/json;base64,([^"]+)/);
          if (base64Match) {
            scriptData = JSON.parse(atob(base64Match[1]));
          } else {
            throw new Error('PNG 文件中未找到有效数据');
          }
        } else {
          throw new Error('不支持的文件格式');
        }

        // 验证必要字段
        if (!scriptData.id || !scriptData.name) {
          throw new Error('剧本数据不完整');
        }

        // 添加到导入列表
        addImportedScript(scriptData);
        refreshScripts();
        setImportSuccess(`成功导入剧本：${scriptData.name}`);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : '导入失败');
      }
    };

    if (file.name.endsWith('.png')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

    // 清空 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = (script: GameScript) => {
    const dataStr = JSON.stringify(script, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (scriptId: string) => {
    if (confirm('确定要删除这个导入的剧本吗？')) {
      removeImportedScript(scriptId);
      refreshScripts();
      setSelectedScript(null);
    }
  };

  const getCharacterInfo = (characterId: string) => {
    return characters.find(c => c.id === characterId);
  };

  const tabs: { id: DetailTab; label: string; icon: typeof FileText }[] = [
    { id: 'intro', label: '介绍', icon: FileText },
    { id: 'world', label: '世界书', icon: BookOpen },
    { id: 'items', label: '道具', icon: Package },
    { id: 'characters', label: '角色', icon: Users },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">游戏剧本</h2>
          <p className="text-sm text-slate-500 mt-1">选择一个剧本开始冒险</p>
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 transition-all shadow-sm"
        >
          <Upload size={18} />
          <span>导入剧本</span>
        </button>
      </div>

      {/* 当前游戏提示 */}
      {gameState.isPlaying && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700">
            <Play size={16} />
            <span className="font-medium">游戏进行中</span>
            <span className="text-emerald-600">·</span>
            <span className="text-emerald-600">
              {scripts.find(s => s.id === gameState.currentScriptId)?.name}
            </span>
          </div>
        </div>
      )}

      {/* 剧本列表 */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {scripts.map((script) => {
          const isImported = importedScriptIds.includes(script.id);
          const isPlaying = gameState.currentScriptId === script.id;

          return (
            <div
              key={script.id}
              onClick={() => setSelectedScript(script)}
              className={`
                group relative rounded-2xl overflow-hidden cursor-pointer
                bg-white border transition-all duration-300
                hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1
                ${isPlaying ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'}
              `}
            >
              {/* 封面图 */}
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100">
                {script.cover ? (
                  <img
                    src={script.cover}
                    alt={script.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={48} className="text-indigo-300" />
                  </div>
                )}
                {/* 标签 */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {isImported && (
                    <span className="px-2 py-1 rounded-md bg-amber-500 text-white text-xs font-medium">
                      导入
                    </span>
                  )}
                  {isPlaying && (
                    <span className="px-2 py-1 rounded-md bg-emerald-500 text-white text-xs font-medium">
                      进行中
                    </span>
                  )}
                </div>
              </div>

              {/* 信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{script.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{script.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{script.participantCount} 人</span>
                  </span>
                  {script.author && <span>作者：{script.author}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 导入弹窗 */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportError(null);
          setImportSuccess(null);
        }}
        title="导入剧本"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            支持导入 JSON 格式的剧本文件
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.png"
            onChange={handleFileImport}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <Upload size={24} />
            <span>点击选择文件</span>
          </button>

          {importError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {importError}
            </div>
          )}

          {importSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
              {importSuccess}
            </div>
          )}
        </div>
      </Modal>

      {/* 剧本详情弹窗 */}
      <Modal
        isOpen={!!selectedScript}
        onClose={() => setSelectedScript(null)}
        title={selectedScript?.name || '剧本详情'}
        size="xl"
      >
        {selectedScript && (
          <div className="space-y-6">
            {/* 封面和基本信息 */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="sm:w-56 flex-shrink-0">
                {selectedScript.cover ? (
                  <img
                    src={selectedScript.cover}
                    alt={selectedScript.name}
                    className="w-full aspect-[3/4] object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                    <BookOpen size={48} className="text-indigo-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{selectedScript.name}</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedScript.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                    <Users size={14} />
                    <span>{selectedScript.participantCount} 名角色</span>
                  </span>
                  {selectedScript.author && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                      作者：{selectedScript.author}
                    </span>
                  )}
                  {selectedScript.version && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                      v{selectedScript.version}
                    </span>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleStartGame(selectedScript)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
                  >
                    <Play size={18} />
                    <span>开始游戏</span>
                  </button>
                  <button
                    onClick={() => handleExport(selectedScript)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download size={18} />
                    <span>导出</span>
                  </button>
                  {importedScriptIds.includes(selectedScript.id) && (
                    <button
                      onClick={() => handleDelete(selectedScript.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                      <span>删除</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 标签页 */}
            <div className="border-b border-slate-200">
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                        ${detailTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 标签页内容 */}
            <div className="min-h-[200px]">
              {/* 介绍 */}
              {detailTab === 'intro' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">开场白</h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 whitespace-pre-wrap">
                      {selectedScript.openingPrompt}
                    </div>
                  </div>
                </div>
              )}

              {/* 世界书 */}
              {detailTab === 'world' && (
                <div className="space-y-3">
                  {selectedScript.worldBooks.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">暂无世界书设定</p>
                  ) : (
                    selectedScript.worldBooks.map((book) => (
                      <div key={book.id} className="rounded-xl border border-slate-200 overflow-hidden">
                        <button
                          onClick={() => setExpandedWorldBook(expandedWorldBook === book.id ? null : book.id)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                        >
                          <div>
                            <div className="font-medium text-slate-800">{book.name}</div>
                            {book.description && (
                              <div className="text-sm text-slate-500 mt-0.5">{book.description}</div>
                            )}
                          </div>
                          {expandedWorldBook === book.id ? (
                            <ChevronUp size={20} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={20} className="text-slate-400" />
                          )}
                        </button>
                        {expandedWorldBook === book.id && (
                          <div className="p-4 space-y-3 bg-white">
                            {book.entries.map((entry, idx) => (
                              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="font-medium text-indigo-600 mb-1">◈ {entry.keyword}</div>
                                <div className="text-sm text-slate-600">{entry.content}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 道具 */}
              {detailTab === 'items' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedScript.items.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 col-span-2">暂无道具设定</p>
                  ) : (
                    selectedScript.items.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-white border border-slate-200">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-slate-800">{item.name}</span>
                          {item.rarity && (
                            <span className={`px-2 py-0.5 rounded text-xs border ${rarityColors[item.rarity]}`}>
                              {rarityLabels[item.rarity]}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                        {item.effect && (
                          <p className="text-sm text-emerald-600">
                            ✦ 效果：{item.effect}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 角色 */}
              {detailTab === 'characters' && (
                <div className="space-y-4">
                  {selectedScript.characters.map((char) => {
                    const charInfo = getCharacterInfo(char.characterId);
                    if (!charInfo) return null;

                    return (
                      <div key={char.characterId} className="p-4 rounded-xl bg-white border border-slate-200">
                        <div className="flex items-start gap-4">
                          {/* 头像 */}
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                            {charInfo.avatar ? (
                              <img src={charInfo.avatar} alt={charInfo.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl">
                                {charInfo.name[0]}
                              </div>
                            )}
                          </div>

                          {/* 信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-800">{charInfo.name}</span>
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs">
                                {char.role}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-3">{char.scriptPersonality}</p>

                            {/* 属性 */}
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(char.stats).map(([key, value]) => (
                                <span key={key} className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-600">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
