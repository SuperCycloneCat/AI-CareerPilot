import { memo } from 'react';

interface StreamOutputProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export const StreamOutput = memo(function StreamOutput({
  content,
  isStreaming = false,
  className = '',
}: StreamOutputProps) {
  if (!content) return null;

  return (
    <div className={`stream-output ${className}`}>
      <div
        className={`prose prose-sm dark:prose-invert max-w-none ${
          isStreaming ? 'typing-cursor' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
      />
    </div>
  );
});

/**
 * 简单的Markdown格式化
 */
function formatMarkdown(text: string): string {
  let html = text;

  // 转义HTML
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');

  // 粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // 列表项
  html = html.replace(/^- \[ \] (.+)$/gm, '<li class="flex items-start gap-2 my-1"><input type="checkbox" disabled class="mt-1" /><span>$1</span></li>');
  html = html.replace(/^- \[x\] (.+)$/gm, '<li class="flex items-start gap-2 my-1"><input type="checkbox" checked disabled class="mt-1" /><span class="line-through text-gray-500">$1</span></li>');
  html = html.replace(/^- (.+)$/gm, '<li class="my-1">• $1</li>');

  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="my-1">$1</li>');

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-sm font-mono">$1</code>');

  // 段落
  html = html.replace(/\n\n/g, '</p><p class="my-3">');
  html = `<p class="my-3">${html}</p>`;

  // 清理空段落
  html = html.replace(/<p class="my-3"><\/p>/g, '');

  return html;
}
