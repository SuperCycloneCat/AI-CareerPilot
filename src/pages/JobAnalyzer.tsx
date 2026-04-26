import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStreamChat } from '../hooks/useStreamChat';
import { buildJobAnalyzerPrompt } from '../prompts/jobAnalyzer';
import { getApiKey, addHistoryItem, generateId } from '../services/storage';
import { StreamOutput } from '../components/StreamOutput';

export function JobAnalyzer() {
  const [jdText, setJdText] = useState('');
  const { isStreaming, streamedText, error, startStream, reset } = useStreamChat();
  const apiKey = getApiKey();

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;

    reset();
    const messages = buildJobAnalyzerPrompt(jdText);

    startStream(messages, {
      apiKey,
      onComplete: (fullText) => {
        // 保存到历史记录
        addHistoryItem({
          id: generateId(),
          type: 'job-analyzer',
          title: jdText.slice(0, 50) + (jdText.length > 50 ? '...' : ''),
          summary: '岗位解读结果',
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
        📋 岗位翻译器
      </h1>
      <p className="text-gray-600 dark:text-white mb-6">
        粘贴JD文本，AI帮你解读真实工作内容、技能要求和适合人群
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区 */}
        <div className="glass-card p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            JD文本
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="粘贴招聘JD，或输入职位名称（如「产品经理」）让AI生成典型JD..."
            className="input-field h-64 resize-none"
            disabled={isStreaming}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-200">
              {jdText.length} 字符
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isStreaming || !jdText.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStreaming ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>分析中...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>开始解读</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 输出区 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">解读结果</h3>
            {streamedText && !isStreaming && (
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
              >
                清空
              </button>
            )}
          </div>

          <div className="min-h-[250px] max-h-[400px] overflow-y-auto">
            {error ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <p className="font-medium">出错了</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : streamedText ? (
              <StreamOutput content={streamedText} isStreaming={isStreaming} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <p>解读结果将在这里显示...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
