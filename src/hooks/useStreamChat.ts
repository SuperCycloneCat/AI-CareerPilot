import { useState, useCallback, useRef } from 'react';
import { streamChat } from '../services/ai';
import type { ChatMessage } from '../types';

interface UseStreamChatOptions {
  apiKey: string;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

export function useStreamChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const startStream = useCallback(
    async (messages: ChatMessage[], options: UseStreamChatOptions) => {
      if (!options.apiKey) {
        setError('请先配置API Key');
        return;
      }

      setIsStreaming(true);
      setStreamedText('');
      setError(null);
      abortRef.current = false;

      let fullText = '';

      try {
        await streamChat(
          options.apiKey,
          messages,
          (chunk) => {
            if (abortRef.current) return;
            fullText += chunk;
            setStreamedText(fullText);
          }
        );

        if (!abortRef.current && options.onComplete) {
          options.onComplete(fullText);
        }
      } catch (err) {
        if (!abortRef.current) {
          const errorMessage = err instanceof Error ? err.message : '未知错误';
          setError(errorMessage);
          options.onError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setIsStreaming(false);
      }
    },
    []
  );

  const abort = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setStreamedText('');
    setError(null);
    abortRef.current = false;
  }, []);

  return {
    isStreaming,
    streamedText,
    error,
    startStream,
    abort,
    reset,
  };
}
