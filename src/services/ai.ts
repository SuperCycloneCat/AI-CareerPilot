import type { ApiConfig, ChatMessage, StreamChunk } from '../types';
import { getModel } from './storage';

const DEFAULT_BASE_URL = 'https://api.siliconflow.cn/v1';

/**
 * 流式调用AI API
 */
export async function streamChat(
  apiKey: string,
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  options?: {
    baseUrl?: string;
    model?: string;
    onReasoning?: (text: string) => void;
  }
): Promise<void> {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const model = options?.model || getModel();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API请求失败: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;

      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;

      try {
        const parsed: StreamChunk = JSON.parse(data);
        const content = parsed.choices[0]?.delta?.content;
        const reasoning = parsed.choices[0]?.delta?.reasoning_content;

        if (content) {
          onChunk(content);
        }
        if (reasoning && options?.onReasoning) {
          options.onReasoning(reasoning);
        }
      } catch {
        // 忽略解析错误
      }
    }
  }
}

/**
 * 测试API连接
 */
export async function testConnection(apiKey: string, model?: string): Promise<{ success: boolean; message: string }> {
  try {
    const useModel = model || getModel();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${DEFAULT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: useModel,
        messages: [
          { role: 'system', content: '请只用一个字回复：好' },
          { role: 'user', content: '测试' }
        ],
        max_tokens: 1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { success: true, message: '连接成功' };
    } else {
      const error = await response.json().catch(() => ({}));
      return { success: false, message: error.message || `连接失败: ${response.status}` };
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { success: false, message: '连接超时（20秒），该模型可能暂时不可用，请稍后重试或切换其他模型' };
    }
    return { success: false, message: `网络错误: ${error instanceof Error ? error.message : '未知错误'}` };
  }
}

/**
 * 非流式调用（用于简单请求）
 */
export async function chat(
  apiKey: string,
  messages: ChatMessage[],
  options?: { baseUrl?: string; model?: string }
): Promise<string> {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const model = options?.model || getModel();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API请求失败: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
