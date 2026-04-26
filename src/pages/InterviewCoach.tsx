import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStreamChat } from '../hooks/useStreamChat';
import {
  buildInterviewQuestionPrompt,
  buildInterviewFeedbackPrompt,
  buildFollowUpQuestionPrompt,
  type InterviewType,
} from '../prompts/interviewCoach';
import { getApiKey, addHistoryItem, generateId } from '../services/storage';
import { StreamOutput } from '../components/StreamOutput';

const interviewTypes: { value: InterviewType; label: string; icon: string; description: string }[] = [
  { value: 'behavioral', label: '行为面试', icon: '🤝', description: '考察过往经历、软技能、团队协作' },
  { value: 'technical', label: '技术面试', icon: '💻', description: '考察专业知识、技术能力' },
  { value: 'case', label: '案例面试', icon: '📊', description: '考察问题分析、逻辑思维' },
];

export function InterviewCoach() {
  const [targetJob, setTargetJob] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('behavioral');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [conversationHistory, setConversationHistory] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState('');

  const {
    isStreaming: isQuestionStreaming,
    streamedText: questionText,
    startStream: startQuestionStream,
    reset: resetQuestion,
  } = useStreamChat();

  const {
    isStreaming: isFeedbackStreaming,
    streamedText: feedbackText,
    startStream: startFeedbackStream,
    reset: resetFeedback,
  } = useStreamChat();

  const apiKey = getApiKey();

  const handleGenerateQuestion = async () => {
    if (!targetJob.trim()) return;

    resetQuestion();
    setCurrentQuestion('');
    setUserAnswer('');
    setCurrentFeedback('');

    const messages = buildInterviewQuestionPrompt(interviewType, targetJob);
    startQuestionStream(messages, {
      apiKey,
      onComplete: (text) => {
        setCurrentQuestion(text);
        setConversationHistory([{ role: 'ai', content: text }]);
      },
    });
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;

    resetFeedback();
    setCurrentFeedback('');

    // 添加用户回答到历史
    setConversationHistory((prev) => [...prev, { role: 'user', content: userAnswer }]);

    const messages = buildInterviewFeedbackPrompt(currentQuestion, userAnswer, targetJob);
    startFeedbackStream(messages, {
      apiKey,
      onComplete: (text) => {
        setCurrentFeedback(text);
        setConversationHistory((prev) => [...prev, { role: 'ai', content: text }]);

        // 保存到历史记录
        addHistoryItem({
          id: generateId(),
          type: 'interview-coach',
          title: `${interviewTypes.find((t) => t.value === interviewType)?.label} - ${targetJob}`,
          summary: currentQuestion.slice(0, 50),
          content: `问题：${currentQuestion}\n\n回答：${userAnswer}\n\n反馈：${text}`,
          createdAt: Date.now(),
        });
      },
    });
  };

  const handleFollowUp = async () => {
    if (!currentQuestion || !userAnswer) return;

    resetFeedback();
    setCurrentFeedback('');

    const messages = buildFollowUpQuestionPrompt(currentQuestion, userAnswer, targetJob);
    startFeedbackStream(messages, {
      apiKey,
      onComplete: (text) => {
        setCurrentQuestion(text);
        setCurrentFeedback('');
        setUserAnswer('');
        setConversationHistory((prev) => [...prev, { role: 'ai', content: text }]);
      },
    });
  };

  const handleReset = () => {
    setCurrentQuestion('');
    setUserAnswer('');
    setCurrentFeedback('');
    setConversationHistory([]);
    resetQuestion();
    resetFeedback();
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
        🎤 面试练习
      </h1>
      <p className="text-gray-600 dark:text-white mb-6">
        模拟真实面试场景，AI生成问题、评估回答并给出改进建议
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：设置和问题 */}
        <div className="space-y-6">
          {/* 设置区 */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">面试设置</h3>

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
                  placeholder="例如：产品经理、前端开发..."
                  className="input-field"
                  disabled={isQuestionStreaming || isFeedbackStreaming}
                />
              </div>

              {/* 面试类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  面试类型
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {interviewTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setInterviewType(type.value)}
                      disabled={isQuestionStreaming || isFeedbackStreaming}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        interviewType === type.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 生成问题按钮 */}
              <button
                onClick={handleGenerateQuestion}
                disabled={isQuestionStreaming || isFeedbackStreaming || !targetJob.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isQuestionStreaming ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <span>🎤</span>
                    <span>生成面试问题</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 当前问题 */}
          {(questionText || currentQuestion) && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🎤</span>
                  <span>面试问题</span>
                </h3>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-200 dark:hover:text-white"
                >
                  重新开始
                </button>
              </div>

              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-gray-800 dark:text-white">
                {isQuestionStreaming ? (
                  <StreamOutput content={questionText} isStreaming />
                ) : (
                  <StreamOutput content={currentQuestion} />
                )}
              </div>
            </div>
          )}

          {/* 回答输入 */}
          {currentQuestion && !isQuestionStreaming && (
            <div className="glass-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">你的回答</h3>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="在这里输入你的回答..."
                className="input-field h-32 resize-none mb-4"
                disabled={isFeedbackStreaming}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isFeedbackStreaming || !userAnswer.trim()}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFeedbackStreaming ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>评估中...</span>
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      <span>提交回答</span>
                    </>
                  )}
                </button>
                {currentFeedback && (
                  <button
                    onClick={handleFollowUp}
                    disabled={isFeedbackStreaming}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <span>🔄</span>
                    <span>继续追问</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：反馈 */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI 反馈</h3>

          <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
            {feedbackText || currentFeedback ? (
              <StreamOutput content={feedbackText || currentFeedback} isStreaming={isFeedbackStreaming} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-12">
                <span className="text-4xl mb-4">💡</span>
                <p>提交回答后，AI将给出评分和改进建议...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
