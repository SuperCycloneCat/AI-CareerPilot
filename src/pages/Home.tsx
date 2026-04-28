import { Link } from 'react-router-dom';
import { getApiKey } from '../services/storage';

const features = [
  {
    icon: '🚀',
    title: '求职一条龙',
    description: '输入一次信息，AI依次完成岗位解读、行动规划、简历优化、面试模拟',
    path: '/all-in-one',
    color: 'from-indigo-500 to-purple-600',
    featured: true,
  },
  {
    icon: '📋',
    title: '岗位翻译器',
    description: '粘贴JD，AI帮你解读真实工作内容、技能要求、不适合人群',
    path: '/job-analyzer',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '📝',
    title: '行动规划师',
    description: '输入目标岗位和你的背景，获得能力诊断 + 4阶段行动清单',
    path: '/action-planner',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📄',
    title: '简历优化',
    description: '粘贴简历片段，AI诊断问题并给出优化建议',
    path: '/resume-coach',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: '🎤',
    title: '面试练习',
    description: '模拟真实面试，AI评分并给出改进建议',
    path: '/interview-coach',
    color: 'from-green-500 to-teal-500',
  },
];

export function Home() {
  const hasApiKey = !!getApiKey();

  return (
    <div className="py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">AI职场行动教练</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-white mb-6">
          从岗位解读到简历面试，全链路AI化求职助手
        </p>
        <p className="text-gray-500 dark:text-white mb-8">
          专为大学生和应届毕业生打造，助你拿到心仪Offer
        </p>

        {!hasApiKey && (
          <Link to="/settings" className="btn-primary inline-flex items-center gap-2">
            <span>⚙️</span>
            <span>开始配置</span>
          </Link>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={hasApiKey ? feature.path : '/settings'}
            className={`glass-card p-6 hover:shadow-lg transition-all duration-300 group ${
              (feature as any).featured ? 'md:col-span-2 ring-2 ring-primary-400/50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-white text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-12 glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>使用小贴士</span>
        </h3>
        <ul className="space-y-3 text-gray-600 dark:text-white">
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>首次使用请先在「设置」页面配置你的硅基流动API Key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>岗位翻译器支持粘贴完整JD，也可以只输入职位名称让AI生成典型JD</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>行动规划师会根据你的背景生成个性化建议，信息越详细结果越准确</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>面试练习支持多轮对话，可以持续深入练习</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
