import { useState, useEffect } from 'react';
import { getApiKey, setApiKey, getModel, setModel, getTheme, setTheme, MODEL_OPTIONS } from '../services/storage';
import { testConnection } from '../services/ai';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const [apiKey, setApiKeyState] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const { theme, setTheme: setAppTheme } = useTheme();

  useEffect(() => {
    setApiKeyState(getApiKey());
    setSelectedModel(getModel());
  }, []);

  const handleSave = () => {
    setApiKey(apiKey);
    setModel(selectedModel);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: '请先输入API Key' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testConnection(apiKey, selectedModel);
    setTestResult(result);
    setIsTesting(false);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        ⚙️ 设置
      </h1>

      {/* API 配置 */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🔑</span>
          <span>API 配置</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              硅基流动 API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKeyState(e.target.value);
                  setTestResult(null);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text');
                  setApiKeyState(pastedText);
                  setTestResult(null);
                }}
                placeholder="sk-xxxxxxxxxxxxxxxx"
                className="input-field pr-20"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              获取API Key：
              <a
                href="https://cloud.siliconflow.cn/account/ak"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline ml-1"
              >
                硅基流动控制台
              </a>
            </p>
          </div>

          {/* 模型选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              AI 模型
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setTestResult(null);
              }}
              className="input-field"
            >
              {MODEL_OPTIONS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label} — {model.description}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              不同模型的速度和能力各有侧重，可根据需求切换
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="btn-secondary flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>测试中...</span>
                </>
              ) : (
                <>
                  <span>🔌</span>
                  <span>测试连接</span>
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <span>💾</span>
              <span>{isSaved ? '已保存 ✓' : '保存'}</span>
            </button>
          </div>

          {/* 测试结果 */}
          {testResult && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                testResult.success
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}
            >
              <span className="text-xl">{testResult.success ? '✅' : '❌'}</span>
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </section>

      {/* 外观设置 */}
      <section className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎨</span>
          <span>外观</span>
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setAppTheme('light')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${
              theme === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'light' ? 'text-amber-500' : 'text-gray-600'}>
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
            </div>
            <div className="font-medium text-gray-900 dark:text-white">白天模式</div>
            <div className="text-sm text-gray-500 dark:text-white">淡蓝色天空 + 白云</div>
          </button>

          <button
            onClick={() => setAppTheme('dark')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all text-center ${
              theme === 'dark'
                ? 'border-primary-400 bg-purple-200 dark:bg-purple-300/80'
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex justify-center mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'dark' ? 'text-indigo-700 dark:text-indigo-800' : 'text-gray-600'}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
            <div className="font-medium text-gray-900 dark:text-gray-900">夜间模式</div>
            <div className="text-sm text-gray-500 dark:text-gray-800">深蓝夜空 + 流星雨</div>
          </button>
        </div>
      </section>

      {/* 关于 */}
      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>ℹ️</span>
          <span>关于</span>
        </h2>

        <div className="space-y-3 text-gray-600 dark:text-white">
          <p>
            <strong className="text-gray-900 dark:text-white">CareerPilot</strong> 是一款AI驱动的求职助手应用。
          </p>
          <p>
            支持多种AI模型，通过硅基流动API提供服务。
          </p>
          <p>
            专为大学生和应届毕业生设计，帮助你更好地理解岗位、规划求职、优化简历、练习面试。
          </p>
        </div>
      </section>
    </div>
  );
}
