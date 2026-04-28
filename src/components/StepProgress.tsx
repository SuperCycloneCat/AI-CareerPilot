export type StepId = 'job-analyzer' | 'action-planner' | 'resume-coach' | 'interview-coach';

export interface StepDefinition {
  id: StepId;
  title: string;
  icon: string;
  description: string;
  isSkippable: boolean;
}

export const STEPS: StepDefinition[] = [
  { id: 'job-analyzer', title: '岗位解读', icon: '📋', description: '解读JD背后的真实信息', isSkippable: false },
  { id: 'action-planner', title: '行动规划', icon: '📝', description: '诊断能力差距，制定行动方案', isSkippable: false },
  { id: 'resume-coach', title: '简历优化', icon: '📄', description: '诊断简历问题并给出优化建议', isSkippable: true },
  { id: 'interview-coach', title: '面试模拟', icon: '🎤', description: '生成面试题与示范回答', isSkippable: false },
];

export interface StepResult {
  stepId: StepId;
  status: 'pending' | 'running' | 'completed' | 'error' | 'skipped';
  content: string;
  error?: string;
}

interface StepProgressProps {
  steps: StepDefinition[];
  currentStepIndex: number;
  stepResults: Record<StepId, StepResult>;
}

export function StepProgress({ steps, currentStepIndex, stepResults }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto px-2">
      {steps.map((step, index) => {
        const result = stepResults[step.id];
        const isActive = index === currentStepIndex && result.status === 'running';
        const isCompleted = result.status === 'completed';
        const isError = result.status === 'error';
        const isSkipped = result.status === 'skipped';
        const isPending = result.status === 'pending';

        return (
          <div key={step.id} className="flex items-center">
            {/* 步骤节点 */}
            <div className="flex flex-col items-center min-w-[70px]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40 scale-110'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : isError
                    ? 'bg-red-500 text-white'
                    : isSkipped
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                {isActive ? (
                  <span className="animate-spin">⏳</span>
                ) : isCompleted ? (
                  <span>✓</span>
                ) : isError ? (
                  <span>✗</span>
                ) : isSkipped ? (
                  <span>—</span>
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium text-center ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-200'
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 mx-1 transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-green-500'
                    : isActive
                    ? 'bg-primary-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
