import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { DayScene } from './DayScene';
import { NightScene } from './NightScene';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'dark' : ''}`}>
      {/* 动态背景场景 */}
      {theme === 'light' ? <DayScene /> : <NightScene />}

      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass-card m-3 md:mx-6">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-lg gradient-text group-hover:opacity-80 transition-opacity">
                CareerPilot
              </span>
            </Link>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-2">
              {/* 移动端历史和设置 */}
              <Link
                to="/history"
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-xl">📁</span>
              </Link>
              <Link
                to="/settings"
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-xl">⚙️</span>
              </Link>

              {/* 主题切换 */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                title={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
              >
                {theme === 'light' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 侧边栏（桌面端） */}
      <Sidebar />

      {/* 主内容区域 */}
      <main className="pt-20 pb-28 md:pb-6 md:pl-60 relative z-10">
        <div className="px-4 md:px-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* 底部导航（移动端） */}
      <BottomNav />
    </div>
  );
}
