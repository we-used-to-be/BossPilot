<div align="center">

# BossPilot

**AI 驱动的 BOSS 求职助手，提供智能岗位匹配、AI 沟通优化和求职流程自动化。**

从简历解析、职业画像、岗位方向选择，到岗位采集、AI 匹配排序、人工确认或自动沟通，集中在一个 Chrome 侧边栏里完成。

[功能介绍](#核心功能) · [AI 工作流程](#ai-工作流程)

![Version](https://img.shields.io/badge/version-v1.3.0-078A83)
![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4)
![Storage](https://img.shields.io/badge/data-local--first-2AA66A)
![Language](https://img.shields.io/badge/language-简体中文-F06284)
![License](https://img.shields.io/badge/license-Apache--2.0-2AA66A)
[![Fork](https://img.shields.io/badge/fork-JobClaw-by%20Chris-blue)](https://github.com/Chrisbetheking/job-claw)

</div>

> BossPilot 是求职者侧的效率工具，不属于 BOSS 直聘官方产品。请使用真实简历信息，遵守平台规则，不要用于骚扰、绕过验证或高频滥用。

---

## 本项目基于 JobClaw 二次开发

> **原项目**：[JobClaw by Chris](https://github.com/Chrisbetheking/job-claw)
>
> **感谢原作者** Chris 提供的基础架构和核心功能实现。
>
> 本项目在 Apache-2.0 许可协议下进行二次开发，不暗示与原项目官方关联。

### 主要改进

| 方向 | 说明 |
| --- | --- |
| AI 工作流重构 | 优化 AI 调用链路，减少冗余请求，提升投递流程稳定性 |
| Token 消耗优化 | 精简 Prompt 结构，压缩上下文，降低 AI 调用成本 |
| 自定义 AI Prompt | 支持更灵活的自定义提示词配置，适配不同求职场景 |
| UI/UX 重设计 | 采用浅色极简风格，优化交互布局，提升使用体验 |

---

## BossPilot 是什么

找工作时，用户通常需要反复完成这些动作：修改搜索词、查看岗位、判断匹配度、组织招呼语、记录投递状态、处理失败任务。

BossPilot 把这些环节整理成一条清晰流程：

```text
导入简历
  → AI 生成职业画像
  → 自主选择投递方向
  → 搜索并采集岗位
  → AI 匹配与自动排序
  → 人工确认 / 全自动沟通
  → 查看进度与失败重试
```

系统默认以**求职者/应聘者**身份工作。所有招呼语都应基于简历和岗位中的真实事实，不应虚构经历、技能、薪资或入职时间。

## 核心功能

| 模块 | 能力 |
| --- | --- |
| 简历中心 | 导入 PDF、DOCX、TXT，保留可编辑的简历原文 |
| 职业画像 | 根据教育、项目、技能和求职条件生成可编辑画像 |
| 投递方向 | 自主勾选岗位方向、修改搜索词、调整优先级、添加自定义方向 |
| 岗位采集 | 根据已保存方向生成搜索任务，采集数量不设固定上限 |
| AI 匹配 | 分析岗位要求，给出匹配分、理由、技能命中和能力缺口 |
| 智能排序 | 综合匹配度、硬性条件、地点、薪资、新鲜度和风险排序 |
| 两种模式 | 支持人工确认，也支持达到阈值后的全自动沟通 |
| 任务进度 | 每个搜索任务和每个岗位都有独立进度、阶段和结果 |
| 失败恢复 | 失败任务可打开原岗位、单条重试、批量重试或忽略 |

## AI 工作流程

BossPilot 的 AI 工作流分为 6 个核心阶段，每个阶段都经过 Token 优化和结果校验：

```text
阶段 1：简历解析与画像生成
  输入：简历原文 + 求职条件
  AI 角色：职业顾问
  输出：结构化职业画像（摘要 / 方向 / 技能 / 硬约束）
  优化：分块处理长简历，避免超长上下文

阶段 2：投递方向规划
  输入：职业画像 + 用户偏好
  AI 角色：求职策略师
  输出：岗位方向清单 + 搜索关键词 + 优先级
  优化：强制可编辑，用户勾选后才生效

阶段 3：岗位采集与初筛
  输入：搜索关键词 + 采集参数
  执行：BOSS 页面采集 → DOM 解析 → 结构化提取
  优化：分页 + 去重 + 数量上限保护

阶段 4：AI 岗位匹配评分
  输入：岗位详情 + 职业画像
  AI 角色：招聘匹配分析师
  输出：匹配分 + 匹配理由 + 技能命中 + 能力缺口 + 风险
  优化：批量压缩提示词，核心字段优先使用规则匹配

阶段 5：招呼语生成与优化
  输入：岗位详情 + 职业画像 + 匹配理由
  AI 角色：应聘者（求职口吻）
  输出：个性化招呼语（真实事实，不虚构经历）
  优化：控制字数，优先体现技能与岗位匹配点

阶段 6：投递执行与结果验证
  执行：页面操作 → 会话建立 → 发送招呼 → 发送附件
  验证：聊天区气泡出现 = 成功；其他均为待确认/失败
  容错：失败分类 → 自动重试/人工介入/任务暂停
```

## 数据与隐私

- 简历、职业画像、筛选条件、API Key 和任务记录默认保存在当前浏览器本地
- 项目不需要用户导出登录 Cookie
- 请勿把真实简历、API Key、手机号、邮箱或完整运行日志提交到公开仓库和 Issue
- 导出诊断信息前，应确认敏感字段已经隐藏

## 安全边界

BossPilot 不应实现或用于：

- 绕过验证码、登录验证或平台安全限制
- 导出、共享或远程托管登录 Cookie
- 伪造简历能力和工作经历
- 多账号群控、骚扰式重复发送或极端高频投递
- 绕过平台规则的反检测行为

出现安全验证、账号异常、页面结构无法确认或聊天对象不确定时，应立即暂停任务并由用户处理。

## 项目结构

<details>
<summary>展开查看目录说明</summary>

```text
BossPilot-v1.3.0/
├── chrome-extension/       可直接加载的 Chrome 扩展
├── source/                 扩展源代码、构建脚本和测试
│   ├── src/                JS 源文件（sidepanel/background/content/offscreen）
│   ├── public/             静态资源（manifest/HTML/CSS）
│   ├── tests/              单元测试、回归测试、验证脚本
│   ├── scripts/            发布检查脚本
│   └── build.mjs           构建入口
├── skills/                 本地 Skill 定义
├── docs/                   新手教程、常见问题和安全说明
│   └── images/             教程截图
├── CHANGELOG.md            版本更新记录
├── LICENSE / NOTICE        Apache-2.0 与署名信息
├── ATTRIBUTION.md          原项目署名与二次开发说明
├── CONTRIBUTING.md         贡献指南
└── SECURITY.md             安全报告方式
```

</details>

## 本地开发

<details>
<summary>展开查看开发命令</summary>

环境建议：Node.js 20 或更高版本。

```bash
cd source
npm test
npm run build
```

构建完成后，请重新进行 Manifest、JavaScript 语法、测试和解压校验，再发布安装包。

</details>

## 反馈与联系

遇到问题时，请通过 GitHub Issue 反馈。

## 开源协议说明

BossPilot 采用 [Apache License 2.0](LICENSE) 开源。本项目基于 JobClaw 二次开发，复制、修改和再分发时，请同时保留：

1. 原项目 `LICENSE` 与 `NOTICE` 文件
2. 本项目的 `NOTICE` 中 BossPilot 二次开发声明
3. 明确标注来源：

> Based on JobClaw by Chris — https://github.com/Chrisbetheking/job-claw
>
> BossPilot — https://github.com/we-used-to-be/BossPilot

详细署名格式见 [ATTRIBUTION.md](ATTRIBUTION.md)。

### 品牌声明

Apache License 2.0 **仅适用于本仓库的源代码**。`BossPilot` 名称、Logo 及品牌标识是项目品牌资产，二次开发者不得使用 `BossPilot` 名称或品牌元素暗示与本项目存在官方关联。详细品牌规则见 [TRADEMARKS.md](TRADEMARKS.md)。

## 免责声明

BossPilot 与 BOSS 直聘及其运营主体不存在隶属、合作或授权关系。"BOSS 直聘"是相关权利人的商标。BossPilot 与 JobClaw 原项目官方无关联，本项目仅提供用户侧的求职信息整理和操作辅助能力，使用者应自行确认信息准确性，并遵守平台规则和适用法律。
