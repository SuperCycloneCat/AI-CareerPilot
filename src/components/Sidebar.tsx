import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, AllInOneIcon, JobIcon, PlanIcon, ResumeIcon, InterviewIcon, HistoryIcon, SettingsIcon } from './NavIcons';

const navItems = [
  { path: '/', label: '首页', Icon: HomeIcon },
  { path: '/all-in-one', label: '求职一条龙', Icon: AllInOneIcon },
  { path: '/job-analyzer', label: '岗位翻译器', Icon: JobIcon },
  { path: '/action-planner', label: '行动规划师', Icon: PlanIcon },
  { path: '/resume-coach', label: '简历优化', Icon: ResumeIcon },
  { path: '/interview-coach', label: '面试练习', Icon: InterviewIcon },
];

const bottomNavItems = [
  { path: '/history', label: '历史记录', Icon: HistoryIcon },
  { path: '/settings', label: '设置', Icon: SettingsIcon },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col fixed left-0 top-20 bottom-0 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="glass-card flex-1 m-3 mr-0 p-3 flex flex-col">
        {/* 折叠按钮 */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="self-end p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors mb-2"
        >
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-200 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* 主导航 */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 底部导航 */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
