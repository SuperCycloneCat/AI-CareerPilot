import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStreamChat } from '../hooks/useStreamChat';
import { buildJobAnalyzerPrompt } from '../prompts/jobAnalyzer';
import { buildActionPlannerPrompt } from '../prompts/actionPlanner';
import { buildResumeCoachPrompt } from '../prompts/resumeCoach';
import { buildAllInOneInterviewPrompt } from '../prompts/allInOne';
import { getApiKey, addHistoryItem, generateId, getUserConfig, setUserConfig } from '../services/storage';
import { TagInput } from '../components/TagInput';
import { StepProgress, STEPS, type StepId, type StepResult } from '../components/StepProgress';
import { StepResultCard } from '../components/StepResultCard';

const gradeOptions = [
  '大一', '大二', '大三', '大四',
  '研一', '研二', '研三',
  '应届毕业生', '工作1-3年',
];

type PagePhase = 'input' | 'running' | 'completed';

const initialStepResults: Record<StepId, StepResult> = {
  'job-analyzer': { stepId: 'job-analyzer', status: 'pending', content: '' },
  'action-planner': { stepId: 'action-planner', status: 'pending', content: '' },
  'resume-coach': { stepId: 'resume-coach', status: 'pending', content: '' },
  'interview-coach': { stepId: 'interview-coach', status: 'pending', content: '' },
};

export function AllInOne() {
  const apiKey = getApiKey();

  // 表单状态
  const [jdText, setJdText] = useState('');
  const [targetJob, setTargetJob] = useState('');
  const [grade, setGrade] = useState('');
  const [major, setMajor] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState('');

  // 页面阶段
  const [phase, setPhase] = useState<PagePhase>('input');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<Record<StepId, StepResult>>(initialStepResults);
  const [isExtracting, setIsExtracting] = useState(false);

  // 用 ref 跟踪步骤结果，避免闭包陷阱
  const stepResultsRef = useRef<Record<StepId, StepResult>>(initialStepResults);

  // 流式输出
  const { isStreaming, streamedText, error, startStream, abort, reset } = useStreamChat();
  const abortRef = useRef(false);

  // 加载已保存的用户配置
  useEffect(() => {
    const savedConfig = getUserConfig();
    if (savedConfig) {
      setGrade(savedConfig.grade);
      setMajor(savedConfig.major);
      setSkills(savedConfig.skills);
    }
  }, []);

  // 执行所有步骤
  const runAllSteps = useCallback(async () => {
    // 保存用户配置
    setUserConfig({ grade, major, skills });

    // 重置步骤结果
    const freshResults: Record<StepId, StepResult> = {
      'job-analyzer': { stepId: 'job-analyzer', status: 'pending', content: '' },
      'action-planner': { stepId: 'action-planner', status: 'pending', content: '' },
      'resume-coach': { stepId: 'resume-coach', status: 'pending', content: '' },
      'interview-coach': { stepId: 'interview-coach', status: 'pending', content: '' },
    };
    stepResultsRef.current = freshResults;
    setStepResults(freshResults);

    setPhase('running');
    abortRef.current = false;

    for (let i = 0; i < STEPS.length; i++) {
      if (abortRef.current) break;

      const step = STEPS[i];

      // 检查是否可跳过
      if (step.isSkippable && step.id === 'resume-coach' && !resumeText.trim()) {
        const updated = { ...stepResultsRef.current, [step.id]: { ...stepResultsRef.current[step.id], status: 'skipped' as const } };
        stepResultsRef.current = updated;
        setStepResults(updated);
        continue;
      }

      setCurrentStepIndex(i);

      // 更新状态为 running
      const runningUpdate = { ...stepResultsRef.current, [step.id]: { ...stepResultsRef.current[step.id], status: 'running' as const, error: undefined } };
      stepResultsRef.current = runningUpdate;
      setStepResults(runningUpdate);

      // 构建该步骤的 prompt
      let messages;
      switch (step.id) {
        case 'job-analyzer':
          messages = buildJobAnalyzerPrompt(jdText);
          break;
        case 'action-planner':
          messages = buildActionPlannerPrompt(targetJob, grade, major, skills);
          break;
        case 'resume-coach':
          messages = buildResumeCoachPrompt(resumeText, targetJob);
          break;
        case 'interview-coach':
          messages = buildAllInOneInterviewPrompt(targetJob, jdText);
          break;
      }

      // 用 Promise 包装流式调用
      await new Promise<void>((resolve) => {
        startStream(messages!, {
          apiKey,
          onComplete: (fullText) => {
            const completedUpdate = { ...stepResultsRef.current, [step.id]: { ...stepResultsRef.current[step.id], status: 'completed' as const, content: fullText } };
            stepResultsRef.current = completedUpdate;
            setStepResults(completedUpdate);
            resolve();
          },
          onError: (err) => {
            const errorUpdate = { ...stepResultsRef.current, [step.id]: { ...stepResultsRef.current[step.id], status: 'error' as const, error: err.message } };
            stepResultsRef.current = errorUpdate;
            setStepResults(errorUpdate);
            resolve();
          },
        });
      });
    }

    if (abortRef.current) {
      setPhase('input');
      return;
    }

    setPhase('completed');

    // 保存到历史记录（使用 ref 中的最新值）
    const results = stepResultsRef.current;
    const completedSteps = STEPS.filter(
      (s) => results[s.id]?.status === 'completed' || (s.id === 'resume-coach' && results[s.id]?.status === 'skipped')
    );
    const sections = STEPS.filter((s) => results[s.id].status === 'completed').map(
      (s) => `## ${s.icon} ${s.title}\n\n${results[s.id].content}`
    );
    const fullContent = sections.join('\n\n---\n\n');

    if (fullContent) {
      addHistoryItem({
        id: generateId(),
        type: 'all-in-one',
        title: `求职一条龙 - ${targetJob}`,
        summary: `完成 ${completedSteps.length}/${STEPS.length} 个步骤`,
        content: fullContent,
        createdAt: Date.now(),
      });
    }
  }, [grade, major, skills, resumeText, apiKey, jdText, targetJob, startStream]);

  // 中止执行
  const handleAbort = () => {
    abortRef.current = true;
    abort();
    setPhase('input');
  };

  // 重新开始
  const handleRestart = () => {
    abortRef.current = true;
    abort();
    setPhase('input');
    setCurrentStepIndex(0);
    const fresh = { ...initialStepResults };
    stepResultsRef.current = fresh;
    setStepResults(fresh);
  };

  // 导出报告
  const handleExport = () => {
    const sections = STEPS.filter((s) => stepResults[s.id].status === 'completed').map(
      (s) => `# ${s.icon} ${s.title}\n\n${stepResults[s.id].content}`
    );
    const report = `# 求职一条龙报告 - ${targetJob}\n\n${sections.join('\n\n---\n\n')}`;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `求职一条龙-${targetJob}-${new Date().toLocaleDateString()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 无 API Key 提示
  if (!apiKey) {
    return (
      <div className="py-8">
        <div className="glass-card p-8 text-center">
          <span className="text-4xl mb-4 block">🔑</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">请先配置API Key</h2>
          <p className="text-gray-600 dark:text-white mb-4">在设置页面配置你的硅基流动API Key后即可使用</p>
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🚀 求职一条龙服务</h1>
      <p className="text-gray-600 dark:text-white mb-6">
        输入一次信息，AI依次完成岗位解读、行动规划、简历优化、面试模拟
      </p>

      {/* Phase 1: 信息录入 */}
      {phase === 'input' && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">填写你的信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JD文本 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                招聘JD <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="粘贴招聘JD全文..."
                className="input-field h-40 resize-none"
              />
            </div>

            {/* 目标岗位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                目标岗位 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  placeholder="例如：产品经理"
                  className="input-field flex-1"
                />
                {jdText && (
                  <button
                    onClick={async () => {
                      if (!jdText.trim()) return;
                      setIsExtracting(true);
                      const { chat } = await import('../services/ai');
                      const { buildExtractJobTitlePrompt } = await import('../prompts/allInOne');
                      try {
                        const result = await chat(apiKey, buildExtractJobTitlePrompt(jdText));
                        setTargetJob(result.trim());
                      } catch {
                        // 静默失败
                      }
                      setIsExtracting(false);
                    }}
                    disabled={isExtracting}
                    className="btn-secondary text-sm whitespace-nowrap"
                  >
                    {isExtracting ? '提取中...' : 'AI提取'}
                  </button>
                )}
              </div>
            </div>

            {/* 年级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                年级 <span className="text-red-500">*</span>
              </label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="input-field">
                <option value="">请选择</option>
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* 专业 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">专业</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="例如：计算机科学"
                className="input-field"
              />
            </div>

            {/* 已掌握技能 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">已掌握的技能</label>
              <TagInput tags={skills} onChange={setSkills} placeholder="输入技能后按回车" className="min-h-[80px]" />
            </div>

            {/* 简历片段 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                简历片段 <span className="text-gray-400">（选填，不填则跳过简历优化步骤）</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="粘贴你的简历片段..."
                className="input-field h-32 resize-none"
              />
            </div>
          </div>

          <button
            onClick={runAllSteps}
            disabled={!jdText.trim() || !targetJob.trim() || !grade}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>🚀</span>
            <span>一键启动</span>
          </button>
        </div>
      )}

      {/* Phase 2 & 3: 执行中 / 已完成 */}
      {(phase === 'running' || phase === 'completed') && (
        <>
          {/* 进度条 */}
          <StepProgress steps={STEPS} currentStepIndex={currentStepIndex} stepResults={stepResults} />

          {/* 当前步骤流式输出 */}
          {phase === 'running' && (
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{STEPS[currentStepIndex]?.icon}</span>
                  <span>{STEPS[currentStepIndex]?.title}</span>
                  {isStreaming && <span className="text-sm text-primary-500 animate-pulse">生成中...</span>}
                </h3>
                <button onClick={handleAbort} className="btn-secondary text-sm">
                  中止
                </button>
              </div>
              <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                {error ? (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    <p className="font-medium">出错了</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                ) : streamedText ? (
                  <div key={currentStepIndex}>
                    <StepResultCard
                      step={STEPS[currentStepIndex]}
                      result={{ ...stepResults[STEPS[currentStepIndex].id], status: 'running', content: streamedText }}
                      isCurrentlyStreaming={true}
                      streamedText={streamedText}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-200">
                    <span className="animate-pulse">准备中...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 已完成步骤的结果卡片 */}
          {phase === 'completed' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">📋 结果总览</h2>
                <div className="flex gap-3">
                  <button onClick={handleExport} className="btn-secondary text-sm flex items-center gap-1">
                    <span>📥</span>
                    <span>导出报告</span>
                  </button>
                  <button onClick={handleRestart} className="btn-primary text-sm flex items-center gap-1">
                    <span>🔄</span>
                    <span>重新开始</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {STEPS.map((step) => (
                  <StepResultCard
                    key={step.id}
                    step={step}
                    result={stepResults[step.id]}
                    isCurrentlyStreaming={false}
                  />
                ))}
              </div>

              {/* 快捷链接 */}
              <div className="glass-card p-6 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🔗 深入使用各模块</h3>
                <p className="text-sm text-gray-600 dark:text-white mb-4">
                  一条龙服务给出的是快速概览，如需更深入的分析，可以单独使用各功能模块：
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { path: '/job-analyzer', label: '岗位翻译器', icon: '📋' },
                    { path: '/action-planner', label: '行动规划师', icon: '📝' },
                    { path: '/resume-coach', label: '简历优化', icon: '📄' },
                    { path: '/interview-coach', label: '面试练习', icon: '🎤' },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
