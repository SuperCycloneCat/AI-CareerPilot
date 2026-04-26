import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, JobIcon, PlanIcon, ResumeIcon, InterviewIcon, HistoryIcon, SettingsIcon } from './NavIcons';

const navItems = [
  { path: '/', label: '首页', Icon: HomeIcon },
  { path: '/job-analyzer', label: '岗位', Icon: JobIcon },
  { path: '/action-planner', label: '规划', Icon: PlanIcon },
  { path: '/resume-coach', label: '简历', Icon: ResumeIcon },
  { path: '/interview-coach', label: '面试', Icon: InterviewIcon },
  { path: '/history', label: '历史', Icon: HistoryIcon },
  { path: '/settings', label: '设置', Icon: SettingsIcon },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card rounded-t-2xl border-t border-x">
        <div className="flex justify-around items-center py-1.5 px-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                <item.Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
