import { useAppStore } from './store';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ChatPage from './pages/ChatPage';
import CharactersPage from './pages/CharactersPage';
import ScriptsPage from './pages/ScriptsPage';
import SavesPage from './pages/SavesPage';
import AIRulesPage from './pages/AIRulesPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

const pageTitles: Record<string, string> = {
  chat: '聊天',
  characters: '角色图鉴',
  scripts: '剧本选择',
  saves: '存档管理',
  'ai-rules': 'AI 规则',
  settings: '设置',
  help: '帮助',
};

function App() {
  const { currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatPage />;
      case 'characters':
        return <CharactersPage />;
      case 'scripts':
        return <ScriptsPage />;
      case 'saves':
        return <SavesPage />;
      case 'ai-rules':
        return <AIRulesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 text-slate-700 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 柔和光斑 */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[100px]" />
        <div className="absolute top-[10%] right-[-15%] w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[20%] w-[700px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[30%] right-[10%] w-[400px] h-[400px] bg-rose-100/40 rounded-full blur-[80px]" />
        {/* 细微网格 */}
        <div 
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* 内容容器 */}
      <div className="relative z-10 flex h-screen">
        {/* 侧边栏 */}
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* 主内容区 */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* 顶部导航 */}
          <Header
            title={pageTitles[currentPage] || ''}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* 页面内容 */}
          <div className="flex-1 overflow-hidden">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
