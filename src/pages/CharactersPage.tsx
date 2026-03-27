import { useState } from 'react';
import { characters } from '../data/characters';
import { Character } from '../types';
import Modal from '../components/Modal';
import { User, Gift, Smile } from 'lucide-react';

type DetailTab = 'info' | 'items' | 'expressions';

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('info');

  const tabs: { id: DetailTab; label: string; icon: typeof User }[] = [
    { id: 'info', label: '基本信息', icon: User },
    { id: 'items', label: '特有道具', icon: Gift },
    { id: 'expressions', label: '表情差分', icon: Smile },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">角色图鉴</h2>
        <p className="text-sm text-slate-500 mt-1">共 {characters.length} 名角色</p>
      </div>

      {/* 角色网格 */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => {
              setSelectedCharacter(character);
              setDetailTab('info');
            }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
          >
            {/* 封面图 */}
            <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50">
              {character.cover ? (
                <img
                  src={character.cover}
                  alt={character.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-indigo-200" />
                </div>
              )}
              {/* 渐变遮罩 */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              {/* 名字 */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-semibold text-white text-lg">{character.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 角色详情弹窗 */}
      <Modal
        isOpen={!!selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        title={selectedCharacter?.name || '角色详情'}
        size="lg"
      >
        {selectedCharacter && (
          <div className="space-y-6">
            {/* 头部信息 */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* 头像 */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-indigo-100 to-violet-100">
                  {selectedCharacter.avatar ? (
                    <img
                      src={selectedCharacter.avatar}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={40} className="text-indigo-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-800">{selectedCharacter.name}</h3>
              </div>

              {/* 基本数据 */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 mb-1">身高</div>
                  <div className="font-semibold text-slate-800">{selectedCharacter.height}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-xs text-slate-500 mb-1">生日</div>
                  <div className="font-semibold text-slate-800">{selectedCharacter.birthday}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500 mb-1">三围</div>
                  <div className="font-semibold text-slate-800">
                    B{selectedCharacter.measurements.bust} / W{selectedCharacter.measurements.waist} / H{selectedCharacter.measurements.hip}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-xs text-slate-500 mb-1">代表颜色</div>
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-300"
                        style={{ backgroundColor: selectedCharacter.color }}
                      />
                      <span className="font-semibold text-slate-800">
                        {selectedCharacter.colorName}
                      </span>
                    </div>
                  </div>
                </div>
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
          {/* 基本信息 */}
          {detailTab === 'info' && (
            <div className="space-y-4">
              {/* 性格 */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-indigo-500">◈</span> 性格
                </h4>
                <p className="text-slate-600 leading-relaxed pl-5">{selectedCharacter.personality}</p>
              </div>

              {/* 说话风格 */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-indigo-500">◈</span> 说话风格
                </h4>
                <p className="text-slate-600 leading-relaxed pl-5">{selectedCharacter.speakingStyle}</p>
              </div>

              {/* 衣着 */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-indigo-500">◈</span> 衣着
                </h4>
                <p className="text-slate-600 leading-relaxed pl-5">{selectedCharacter.outfit}</p>
              </div>

              {/* 立绘 */}
              {selectedCharacter.reference && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-indigo-500">◈</span> 参考立绘
                  </h4>
                  <div className="pl-5">
                    <img
                      src={selectedCharacter.reference}
                      alt={selectedCharacter.name}
                      className="max-w-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 特有道具 */}
          {detailTab === 'items' && (
            <div className="space-y-3">
              {selectedCharacter.items.length === 0 ? (
                <p className="text-slate-500 text-center py-8">暂无特有道具</p>
              ) : (
                selectedCharacter.items.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{item.icon || '◈'}</span>
                      <span className="font-medium text-slate-800">{item.name}</span>
                    </div>
                    <p className="text-slate-600 text-sm pl-7">{item.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 表情差分 */}
          {detailTab === 'expressions' && (
            <div>
              {selectedCharacter.expressions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">暂无表情差分</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {selectedCharacter.expressions.map((expr, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      {expr.file ? (
                        <img
                          src={`/images/expressions/${expr.file}`}
                          alt={expr.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Smile size={24} />
                        </div>
                      )}
                      {/* 名称标签 */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="text-white text-xs">{expr.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  )
}
      </Modal >
    </div >
  );
}
