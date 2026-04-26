import type { ChatMessage } from '../types';

export type InterviewType = 'behavioral' | 'technical' | 'case';

/**
 * 面试练习 - 生成问题 Prompt
 */
export function buildInterviewQuestionPrompt(
  interviewType: InterviewType,
  targetJob: string
): ChatMessage[] {
  const typeDescriptions = {
    behavioral: '行为面试（考察过往经历、软技能、团队协作等）',
    technical: '技术面试（考察专业知识、技术能力）',
    case: '案例面试（考察问题分析、逻辑思维能力）',
  };

  return [
    {
      role: 'system',
      content: `你是一位资深的面试官，擅长${typeDescriptions[interviewType]}。

请针对目标岗位，生成一个面试问题。要求：
1. 问题要有针对性，与岗位相关
2. 问题难度适中
3. 只输出问题本身，不要输出其他内容

输出格式：
## 🎤 面试问题
[问题内容]`,
    },
    {
      role: 'user',
      content: `目标岗位：${targetJob}
面试类型：${typeDescriptions[interviewType]}

请生成一个面试问题。`,
    },
  ];
}

/**
 * 面试练习 - 评估回答 Prompt
 */
export function buildInterviewFeedbackPrompt(
  question: string,
  answer: string,
  targetJob: string
): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一位资深的面试官和求职教练，擅长评估面试回答并给出改进建议。

请对用户的面试回答进行评估，格式如下：

## 📊 回答评分
[给出1-10分的评分，并简要说明理由]

## ✅ 回答亮点
[列出回答中做得好的地方]

## ⚠️ 需要改进的地方
[列出回答中需要改进的地方]

## 💡 改进建议
[给出具体的改进建议]

## ✨ 更好的回答示范
[给出一个优化后的回答示例]

请用中文回答，语言亲切但专业，给出具体可行的建议。`,
    },
    {
      role: 'user',
      content: `**目标岗位**：${targetJob}

**面试问题**：
${question}

**我的回答**：
${answer}

请评估我的回答并给出改进建议。`,
    },
  ];
}

/**
 * 面试练习 - 追问 Prompt
 */
export function buildFollowUpQuestionPrompt(
  question: string,
  answer: string,
  targetJob: string
): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一位资深的面试官，擅长根据候选人的回答进行追问。

请根据用户的回答，生成一个追问问题。追问应该：
1. 深入挖掘细节
2. 验证回答的真实性
3. 考察更深层次的能力

只输出追问问题，不要输出其他内容。

输出格式：
## 🎤 追问
[追问内容]`,
    },
    {
      role: 'user',
      content: `**目标岗位**：${targetJob}

**原问题**：
${question}

**候选人回答**：
${answer}

请生成一个追问。`,
    },
  ];
}
