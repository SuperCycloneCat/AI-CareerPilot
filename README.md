# 🚀 CareerPilot · AI职场行动教练

> 从岗位解读到简历面试，全链路AI化求职助手。专为大学生和应届毕业生打造。

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.2-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8.0-646cff?logo=vite)

---

## ✨ 功能特色

| 模块 | 功能描述 |
|------|---------|
| 📋 **岗位翻译器** | 粘贴JD，AI帮你解读真实工作内容、硬技能/软技能要求、不适合人群 |
| 📝 **行动规划师** | 输入目标岗位和你的背景，AI生成能力诊断 + 4阶段行动清单 |
| 📄 **简历优化** | 粘贴简历片段，AI诊断问题并给出STAR法则改写建议 |
| 🎤 **面试练习** | 模拟真实面试（行为/技术/案例），AI评分并给出改进建议 |
| 🌙 **白天/夜间模式** | 白天蓝天白云 ☁️，夜间星空流星 🌠，一键切换 |
| 📁 **历史记录** | 所有使用记录自动保存，随时回顾 |

---

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式方案**: TailwindCSS 4（CSS原生配置）
- **路由**: React Router v7
- **AI模型**: 硅基流动 API（Qwen/Qwen2.5-72B-Instruct）
- **部署**: 支持静态部署（Vercel / Netlify / GitHub Pages）

---

## 📦 本地部署指南

### 环境要求

请确保你的电脑已安装以下软件：

| 软件 | 版本要求 | 安装地址 |
|------|---------|---------|
| **Node.js** | >= 18.0 | [https://nodejs.org](https://nodejs.org) |
| **npm** | >= 9.0（随Node.js一起安装） | - |
| **Git** | >= 2.0 | [https://git-scm.com](https://git-scm.com) |

> 💡 **如何检查是否已安装？** 打开终端（Windows按 `Win+R` 输入 `cmd`，Mac按 `Command+空格` 搜索"终端"），输入以下命令：
> ```
> node -v    # 应显示 v18.x.x 或更高
> npm -v     # 应显示 9.x.x 或更高
> git --version  # 应显示 git version 2.x.x
> ```

---

### 第一步：获取项目代码

打开终端，执行以下命令：

```bash
# 克隆仓库到本地
git clone https://github.com/SuperCycloneCat/AI-CareerPilot.git

# 进入项目目录
cd AI-CareerPilot
```

---

### 第二步：安装依赖

```bash
npm install
```

> ⏱️ 安装过程大约需要 30 秒到 2 分钟，取决于网络速度。

---

### 第三步：获取硅基流动 API Key

本项目使用硅基流动（SiliconFlow）提供的AI API，你需要一个免费的API Key：

1. 访问 [硅基流动官网](https://cloud.siliconflow.cn) 并注册账号
2. 登录后，点击右上角头像 → **API密钥**
3. 点击 **创建API密钥**，复制生成的密钥（格式为 `sk-xxxxxxxxxxxxxxxx`）

> 💡 **新用户福利**：硅基流动新注册用户通常赠送免费额度，足够日常使用。

---

### 第四步：启动开发服务器

```bash
npm run dev
```

启动成功后，终端会显示：

```
  VITE v8.0.9  ready in 218 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

在浏览器中打开 **http://localhost:5173** 即可看到应用。

---

### 第五步：配置 API Key

1. 在应用首页点击右上角 **⚙️ 设置** 按钮（或底部导航栏的"设置"）
2. 在 **API 配置** 区域粘贴你的硅基流动 API Key
3. 点击 **💾 保存** 按钮
4. （可选）点击 **🔌 测试连接** 验证API Key是否可用

配置完成后，即可开始使用所有AI功能！

---

## 🎯 使用指南

### 岗位翻译器
1. 找到一个招聘JD（职位描述），复制全文
2. 进入「岗位翻译器」，粘贴到输入框
3. 点击「开始解读」，AI会分析真实工作场景、技能要求、不适合人群

### 行动规划师
1. 进入「行动规划师」
2. 填写你的目标岗位、年级、专业、已掌握的技能
3. 点击「生成规划」，AI会输出能力诊断 + 4阶段行动清单

### 简历优化
1. 进入「简历优化」
2. 填写目标岗位（可选），粘贴你的简历片段
3. 点击「开始优化」，AI会诊断问题并给出改写建议

### 面试练习
1. 进入「面试练习」
2. 填写目标岗位，选择面试类型（行为/技术/案例）
3. 点击「生成面试问题」，AI会出题
4. 输入你的回答后点击「提交回答」，AI会评分并给出改进建议
5. 可点击「继续追问」进行多轮练习

---

## 📁 项目结构

```
AI-CareerPilot/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 通用组件
│   │   ├── Layout.tsx      # 页面布局（顶栏+侧边栏+底栏）
│   │   ├── BottomNav.tsx   # 移动端底部导航
│   │   ├── Sidebar.tsx     # 桌面端侧边栏
│   │   ├── DayScene.tsx    # 白天场景（太阳+云朵）
│   │   ├── NightScene.tsx  # 夜间场景（星空+流星）
│   │   ├── NavIcons.tsx    # 导航SVG图标
│   │   ├── StreamOutput.tsx # AI流式输出渲染
│   │   ├── TagInput.tsx    # 标签输入组件
│   │   └── RadarChart.tsx  # 雷达图组件
│   ├── contexts/           # React上下文
│   │   └── ThemeContext.tsx # 主题（白天/夜间）管理
│   ├── hooks/              # 自定义Hooks
│   │   └── useStreamChat.ts # AI流式对话Hook
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   ├── Settings.tsx    # 设置页
│   │   ├── JobAnalyzer.tsx # 岗位翻译器
│   │   ├── ActionPlanner.tsx # 行动规划师
│   │   ├── ResumeCoach.tsx # 简历优化
│   │   ├── InterviewCoach.tsx # 面试练习
│   │   └── History.tsx     # 历史记录
│   ├── prompts/            # AI提示词
│   │   ├── jobAnalyzer.ts
│   │   ├── actionPlanner.ts
│   │   ├── resumeCoach.ts
│   │   └── interviewCoach.ts
│   ├── services/           # 服务层
│   │   ├── ai.ts           # AI API调用（流式/非流式）
│   │   └── storage.ts      # 本地存储管理
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── App.tsx             # 应用入口
│   ├── main.tsx            # 渲染入口
│   └── index.css           # 全局样式（TailwindCSS v4）
├── index.html              # HTML入口
├── package.json            # 项目配置
├── postcss.config.js       # PostCSS配置
├── tsconfig.json           # TypeScript配置
└── vite.config.ts          # Vite配置
```

---

## 🔧 常用命令

```bash
# 启动开发服务器（热更新）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

---

## 🌐 部署到线上

构建完成后，`dist/` 目录就是静态文件，可以部署到任何静态托管服务：

### Vercel（推荐）
```bash
npm i -g vercel
vercel
```

### Netlify
将 `dist/` 目录拖拽到 [Netlify Drop](https://app.netlify.com/drop) 即可。

### GitHub Pages
1. 安装 `gh-pages`：`npm install -D gh-pages`
2. 在 `vite.config.ts` 中设置 `base: '/AI-CareerPilot/'`
3. 执行 `npm run build && npx gh-pages -d dist`

---

## 📄 开源协议

MIT License

---

## 🙏 致谢

- [TRAE SOLO](https://solo.trae.ai) - 本项目使用 TRAE SOLO 进行开发，感谢 TRAE SOLO 提供的 AI 辅助编程能力
- [硅基流动](https://siliconflow.cn) - 提供AI模型API服务
- [Qwen](https://qwenlm.github.io) - Qwen2.5 大语言模型
- [React](https://react.dev) - 前端框架
- [TailwindCSS](https://tailwindcss.com) - CSS框架
- [Vite](https://vite.dev) - 构建工具
