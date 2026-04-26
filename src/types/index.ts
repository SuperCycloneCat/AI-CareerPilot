// 消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 流式响应
export interface StreamChunk {
  id: string;
  choices: {
    delta: {
      content?: string;
      reasoning_content?: string;
    };
    finish_reason: string | null;
  }[];
}

// API配置
export interface ApiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

// 历史记录
export interface HistoryItem {
  id: string;
  type: 'job-analyzer' | 'action-planner' | 'resume-coach' | 'interview-coach';
  title: string;
  summary: string;
  content: string;
  createdAt: number;
}

// 用户配置
export interface UserConfig {
  grade: string;
  major: string;
  skills: string[];
}

// 能力诊断结果
export interface SkillAssessment {
  matched: string[];
  partial: string[];
  missing: string[];
  score: number;
}

// 行动规划
export interface ActionPlan {
  stage1: ActionStage;
  stage2: ActionStage;
  stage3: ActionStage;
  stage4: ActionStage;
  prioritySkill: string;
}

export interface ActionStage {
  title: string;
  duration: string;
  actions: string[];
  resources: string[];
}

// 主题类型
export type Theme = 'light' | 'dark';

// 导航项
export interface NavItem {
  path: string;
  label: string;
  icon: string;
}
