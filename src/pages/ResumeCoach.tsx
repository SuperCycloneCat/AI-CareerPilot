import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStreamChat } from '../hooks/useStreamChat';
import { buildResumeCoachPrompt } from '../prompts/resumeCoach';
import { getApiKey, addHistoryItem, generateId } from '../services/storage';
import { StreamOutput } from '../components/StreamOutput';

export function ResumeCoach() {
  const [resumeText, setResumeText] = useState('');
  const [targetJob, setTargetJob] = useState('');
  const { isStreaming, streamedText, error, startStream, reset } = useStreamChat();
  const apiKey = getApiKey();

  const handleOptimize = async () => {
    if (!resumeText.trim()) return;

    reset();
    const messages = buildResumeCoachPrompt(resumeText, targetJob || '通用岗位');

    startStream(messages, {
      apiKey,
      onComplete: (fullText) => {
        addHistoryItem({
          id: generateId(),
          type: 'resume-coach',
          title: '简历优化',
          summary: targetJob || '通用岗位',
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
        📄 简历优化
      </h1>
      <p className="text-gray-600 dark:text-white mb-6">
        粘贴简历片段，AI帮你诊断问题并给出优化建议
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区 */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {/* 目标岗位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                目标岗位（可选）
              </label>
              <input
                type="text"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="例如：产品经理、前端开发..."
                className="input-field"
                disabled={isStreaming}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-200">
                填写目标岗位可以让AI给出更有针对性的建议
              </p>
            </div>

            {/* 简历片段 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                简历片段 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="粘贴你的简历片段，例如某段实习经历、项目经历或自我评价..."
                className="input-field h-64 resize-none"
                disabled={isStreaming}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-200">
                {resumeText.length} 字符
              </span>
              <button
                onClick={handleOptimize}
                disabled={isStreaming || !resumeText.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStreaming ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>优化中...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>开始优化</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 输出区 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">优化建议</h3>
            {streamedText && !isStreaming && (
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
              >
                清空
              </button>
            )}
          </div>

          <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
            {error ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <p className="font-medium">出错了</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : streamedText ? (
              <StreamOutput content={streamedText} isStreaming={isStreaming} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-12">
                <span className="text-4xl mb-4">📝</span>
                <p>优化建议将在这里显示...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card p-4 mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>💡</span>
          <span>简历优化小技巧</span>
        </h4>
        <ul className="text-sm text-gray-600 dark:text-white space-y-1">
          <li>• 使用STAR法则描述经历：情境(Situation) → 任务(Task) → 行动(Action) → 结果(Result)</li>
          <li>• 用数据量化成果：如"提升用户留存率15%"而非"提升了用户留存率"</li>
          <li>• 突出与目标岗位相关的关键词和技能</li>
          <li>• 避免空洞的描述，如"学习能力强"、"善于沟通"等，用具体事例证明</li>
        </ul>
      </div>
    </div>
  );
}
