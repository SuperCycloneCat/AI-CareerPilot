import { useState } from 'react';
import { StreamOutput } from './StreamOutput';
import type { StepDefinition, StepResult, StepId } from './StepProgress';

interface StepResultCardProps {
  step: StepDefinition;
  result: StepResult;
  isCurrentlyStreaming: boolean;
  streamedText?: string;
}

export function StepResultCard({
  step,
  result,
  isCurrentlyStreaming,
  streamedText,
}: StepResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusLabel = {
    pending: '等待中',
    running: '进行中...',
    completed: '已完成',
    error: '出错',
    skipped: '已跳过',
  };

  const statusColor = {
    pending: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    running: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    skipped: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  };

  const displayText = isCurrentlyStreaming ? streamedText || '' : result.content;
  const hasContent = displayText.length > 0;

  return (
    <div
      className={`glass-card overflow-hidden transition-all duration-300 ${
        result.status === 'running' ? 'ring-2 ring-primary-400/50' : ''
      }`}
    >
      {/* 卡片头部 */}
      <button
        onClick={() => hasContent && setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 text-left ${
          hasContent ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50' : ''
        } transition-colors`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{step.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
            {result.status === 'error' && result.error && (
              <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">{result.error}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[result.status]}`}>
            {statusLabel[result.status]}
          </span>
          {hasContent && (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {/* 展开内容 */}
      {(isExpanded || isCurrentlyStreaming) && hasContent && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-slate-700/50">
          <div className="mt-3 max-h-[400px] overflow-y-auto">
            <StreamOutput content={displayText} isStreaming={isCurrentlyStreaming} />
          </div>
        </div>
      )}
    </div>
  );
}
