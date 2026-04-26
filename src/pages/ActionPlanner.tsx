import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStreamChat } from '../hooks/useStreamChat';
import { buildActionPlannerPrompt } from '../prompts/actionPlanner';
import { getApiKey, addHistoryItem, generateId, getUserConfig, setUserConfig } from '../services/storage';
import { StreamOutput } from '../components/StreamOutput';
import { TagInput } from '../components/TagInput';

const gradeOptions = [
  '大一',
  '大二',
  '大三',
  '大四',
  '研一',
  '研二',
  '研三',
  '应届毕业生',
  '工作1-3年',
];

export function ActionPlanner() {
  const [targetJob, setTargetJob] = useState('');
  const [grade, setGrade] = useState('');
  const [major, setMajor] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const { isStreaming, streamedText, error, startStream, reset } = useStreamChat();
  const apiKey = getApiKey();

  // 加载已保存的用户配置
  useEffect(() => {
    const savedConfig = getUserConfig();
    if (savedConfig) {
      setGrade(savedConfig.grade);
      setMajor(savedConfig.major);
      setSkills(savedConfig.skills);
    }
  }, []);

  const handlePlan = async () => {
    if (!targetJob.trim() || !grade) return;

    // 保存用户配置
    setUserConfig({ grade, major, skills });

    reset();
    const messages = buildActionPlannerPrompt(targetJob, grade, major, skills);

    startStream(messages, {
      apiKey,
      onComplete: (fullText) => {
        addHistoryItem({
          id: generateId(),
          type: 'action-planner',
          title: `${targetJob} - 求职规划`,
          summary: `${grade} · ${major || '未填写专业'}`,
          content: fullText,
          createdAt: Date.now(),
        });
      },
    });
  };

  if (!apiKey) {
    return (
      <div className="py-8">
        <div className="glass-card p-8 text-center">
          <span className="text-4xl mb-4 block">🔑</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            请先配置API Key
          </h2>
          <p className="text-gray-600 dark:text-white mb-4">
            在设置页面配置你的硅基流动API Key后即可使用
          </p>
          <Link to="/settings" className="btn-primary inline-flex items-center gap-2">
            <span>⚙️</span>
            <span>前往设置</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        📝 行动规划师
      </h1>
      <p className="text-gray-600 dark:text-white mb-6">
        输入你的目标岗位和背景，AI帮你诊断能力差距并制定4阶段行动规划
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区 */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {/* 目标岗位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                目标岗位 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="例如：产品经理、前端开发、运营专员..."
                className="input-field"
                disabled={isStreaming}
              />
            </div>

            {/* 年级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                年级 <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="input-field"
                disabled={isStreaming}
              >
                <option value="">请选择</option>
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* 专业 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                专业
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="例如：计算机科学、市场营销、工商管理..."
                className="input-field"
                disabled={isStreaming}
              />
            </div>

            {/* 已掌握技能 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                已掌握的技能
              </label>
              <TagInput
                tags={skills}
                onChange={setSkills}
                placeholder="输入技能后按回车添加"
                className="min-h-[100px]"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-200">
                例如：Python、数据分析、PPT制作、英语六级...
              </p>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handlePlan}
              disabled={isStreaming || !targetJob.trim() || !grade}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStreaming ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>规划中...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>生成规划</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 输出区 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">规划结果</h3>
            {streamedText && !isStreaming && (
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
              >
                清空
              </button>
            )}
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
            {error ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <p className="font-medium">出错了</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : streamedText ? (
              <StreamOutput content={streamedText} isStreaming={isStreaming} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-12">
                <span className="text-4xl mb-4">📊</span>
                <p>能力诊断和行动规划将在这里显示...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
