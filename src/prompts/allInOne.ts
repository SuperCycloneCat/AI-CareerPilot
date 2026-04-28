import type { ChatMessage } from '../types';

/**
 * 一条龙面试模拟 Prompt
 * 一次性生成：面试问题 + 示范回答 + 评估要点
 */
export function buildAllInOneInterviewPrompt(
  targetJob: string,
  jdText: string
): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一位资深的面试官和求职教练。请根据目标岗位和JD，生成一个完整的面试练习场景。

请严格按照以下格式输出：

## 🎤 面试问题
[生成一道与目标岗位高度相关的面试问题，难度适中]

## ✨ 优秀回答示范
[给出一个高质量的回答示例，使用STAR法则，约200-300字]

## 📊 评分要点
[列出评估这个回答时面试官会关注的3-5个关键点]
- 要点1：[说明]
- 要点2：[说明]

## 💡 加分技巧
[给出2-3个让回答更出彩的技巧建议]

请用中文回答，问题要有针对性和实用性。`,
    },
    {
      role: 'user',
      content: `**目标岗位**：${targetJob}

**岗位JD**：
${jdText}

请生成一道面试题，并给出示范回答和评估要点。`,
    },
  ];
}

/**
 * 从JD中提取目标岗位名称
 */
export function buildExtractJobTitlePrompt(jdText: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `你是一个文本分析助手。请从用户提供的JD文本中提取目标岗位名称。

规则：
1. 只输出岗位名称，不要输出任何其他内容
2. 如果JD中有明确的职位名称，直接使用
3. 如果有多个职位，取最主要的那个
4. 输出不超过20个字`,
    },
    {
      role: 'user',
      content: `请从以下JD中提取目标岗位名称：\n\n${jdText}`,
    },
  ];
}
