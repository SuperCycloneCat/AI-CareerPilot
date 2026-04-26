import type { HistoryItem } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'career-pilot-api-key',
  THEME: 'career-pilot-theme',
  HISTORY: 'career-pilot-history',
  USER_CONFIG: 'career-pilot-user-config',
};

/**
 * API Key 存储
 */
export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
}

/**
 * 主题存储
 */
export function getTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  // 默认跟随系统
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * 历史记录存储
 */
export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addHistoryItem(item: HistoryItem): void {
  const history = getHistory();
  history.unshift(item);
  // 最多保存100条
  if (history.length > 100) {
    history.pop();
  }
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

/**
 * 用户配置存储
 */
export function getUserConfig(): { grade: string; major: string; skills: string[] } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setUserConfig(config: { grade: string; major: string; skills: string[] }): void {
  localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
