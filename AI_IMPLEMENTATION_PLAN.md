# AI Implementation Plan

## 当前状态

- 当前阶段：阶段 1｜AI Token 优化闭环
- 阶段状态：进行中
- 上次执行结果：
  - 已完成实际代码入口、缓存边界、投递调用链和安全校验定位
  - 已确认旧任务全部完成，本次在现有未提交改动上精准追加
- 验证结果：尚未执行
- 本阶段剩余：
  - 拆分岗位匹配与招呼语生成
  - 增加 profileFacts/resumeHash 缓存
  - 增加自定义 AI 指令设置并接入招呼语 Prompt
  - 完成定向测试、构建与快速回归
- 本阶段允许修改：
  - `source/src/common.js`
  - `source/src/background.js`
  - `source/src/sidepanel.js`
  - `source/public/sidepanel.html`
  - `source/public/styles.css`
  - `source/tests/**`
  - `chrome-extension/` 对应构建产物
- 阻塞问题：无
- 下一阶段：无（本阶段完成即项目目标完成）

## 项目目标

降低批量岗位分析 Token 消耗，同时保持匹配、投递、会话安全和发送确认逻辑不变：

1. `analyzeJob` 只生成 `score`、`decision`、`matchedSkills`、`gaps`、`risks`、`reason`。
2. 招呼语只在人工确认、批量确认、自动投递或失败重试前独立生成，并继续经过现有求职者口吻安全检测。
3. 保存 `profileFacts` 与 `resumeHash`，简历未变化时复用结构化数据，岗位分析不再发送完整简历。
4. 设置页增加自定义招呼语指令；最终 Prompt 为不可覆盖的默认安全/格式规则加用户要求。

## 阶段计划

### 阶段 1｜AI Token 优化闭环

- 范围：AI Prompt、简历结构化缓存、投递前招呼语生成、设置字段和定向测试。
- 验收标准：
  - [ ] 岗位匹配 Prompt 不含完整简历与 greeting 字段。
  - [ ] 匹配结果稳定返回六个约定字段。
  - [ ] `profileFacts`、`resumeHash` 本地保存，简历变化时缓存失效并重建。
  - [ ] 招呼语仅在投递确认/自动投递/重试入口生成。
  - [ ] 自定义要求可影响招呼语，但不能覆盖安全规则和 JSON 输出格式。
  - [ ] 原有发送安全、队列排序、会话绑定与附件顺序定向回归通过。
- 检查命令：
  - `node tests/ui38-ai-token-flow.mjs`
  - `node tests/ui9-applicant-modes.mjs`
  - `node tests/ui18-retry-runtime.mjs`
  - `node tests/ui20-text-before-attachment.mjs`
  - `node tests/ui24-external-application-skip.mjs`
  - `node tests/ui30-chat-atomic-sort.mjs`
  - `npm run check:syntax`
  - `npm run test:unit`
  - `npm run build`
- 暂不处理：不修改 BOSS 页面会话识别、实际发送、附件上传或岗位采集策略。

## 当前阶段详细任务

### 实施任务

1. 为结构化简历事实增加规范化、哈希、缓存复用与失效逻辑。
2. 将岗位匹配 Prompt 收窄为职业画像、技能、项目摘要和岗位信息。
3. 新增独立招呼语生成，并接入人工、批量、自动与重试投递入口。
4. 设置页增加自定义招呼语要求，兼容 `customPrompt`/`customInstruction`。
5. 增加 Token 输入边界、调用时机、缓存与安全规则测试。

### 禁止事项

- 不修改现有会话锁、发送确认、附件顺序和外部网申跳过逻辑。
- 不升级依赖，不重构无关模块。
- 不提交或推送代码。

## 旧任务状态（已归档）

- 当前阶段：全部阶段已完成
- 阶段状态：已完成
- 上次执行结果：
  - 阶段 1：移除 OpenClaw 所有代码、页面、目录和引用
  - 阶段 2：安装 Hallmark Skill，使用 OKLCH 色彩 + 去除 AI 生成痕迹优化界面
  - 阶段 3：待确认岗位卡片添加"打开岗位"按钮
  - 阶段 4：完成 AI 提示词分析，给出 4 类优化建议
- 验证结果：
  - `npm run build`：通过
  - `npm run test:unit`：通过
- 本阶段剩余：无
- 阻塞问题：无
- 下一阶段：无（全部完成）

## 旧任务目标（已归档）

1. 简化插件，移除 OpenClaw（桌面桥接）相关所有内容和代码 ✅
2. 安装 Hallmark 设计 Skill，优化界面风格 ✅
3. 消息页面"待确认岗位"卡片添加"打开岗位"按钮 ✅
4. 分析 AI 流程，给出提示词优化方案 ✅

## 技术栈

- 运行环境：Chrome Extension Manifest V3
- 编程语言：JavaScript (ES Module)
- 核心依赖：无外部框架，纯 Vanilla JS + CSS
- 测试工具：Node.js 内置 test runner（.mjs 文件）
- 构建工具：自定义 build.mjs（复制 source/ → chrome-extension/）

## 总体约束

- 优先最小改动。
- 不重构无关模块。
- 不自动提交或推送代码。
- 不在未读取代码前假设实现。
- 不提前实现后续阶段。
- 构建产物（chrome-extension/）与源码（source/）同步修改。

## 旧任务阶段计划（已归档）

### 阶段 1｜移除 OpenClaw 相关内容

- 目标：从项目中彻底移除 OpenClaw/桌面桥接相关的代码、页面、文件和引用
- 范围：
  - source/src/background.js：移除 bridge 函数、BRIDGE_ENDPOINTS、handleBridgeCommands、bridge 相关消息处理
  - source/src/sidepanel.js：移除 OpenClaw 页面导航、bridge 检测/命令/日报相关函数
  - source/public/sidepanel.html：移除 OpenClaw 页面 section 和导航按钮
  - source/public/manifest.json：移除 description 中的 "OpenClaw"、移除 localhost host_permissions
  - chrome-extension/：同步上述修改
  - desktop-bridge/：删除整个目录
  - skills/jobclaw/：删除整个目录（OpenClaw Skill）
  - source/tests/validate.mjs：移除 openclaw 页面预期
  - docs/：移除 OpenClaw 相关图片和文档引用
- 验收标准：
  - [ ] 所有 OpenClaw 相关代码已移除
  - [ ] sidepanel 导航从 5 个减少到 4 个
  - [ ] desktop-bridge/ 目录已删除
  - [ ] skills/jobclaw/ 目录已删除
  - [ ] 构建产物与源码一致
  - [ ] 测试通过
- 检查命令：`npm run build && npm run test:unit`
- 暂不处理：不处理 docs/ 中的 README、常见问题等文档文件（仅移除图片引用，不重写文档）

### 阶段 2｜安装 Hallmark Skill 并优化界面

- 目标：从 GitHub 下载 Hallmark Skill 到 skills/ 目录，并使用其设计原则优化界面风格
- 范围：
  - 下载 skills/hallmark/SKILL.md 和 references/ 目录
  - 使用 hallmark 对 styles.css 进行 redesign
- 验收标准：
  - [ ] skills/hallmark/ 目录存在且包含完整 SKILL.md 和 references/
  - [ ] 界面风格有明显优化，不再使用默认 AI 生成风格
  - [ ] 构建通过
- 检查命令：`npm run build`
- 暂不处理：不改变页面布局结构，只优化视觉风格

### 阶段 3｜消息页面"待确认岗位"卡片添加"打开岗位"按钮

- 目标：在每条待确认岗位卡片上增加"打开岗位"按钮，点击后在新标签页打开 BOSS 直聘岗位详情
- 范围：
  - source/src/sidepanel.js：修改 createQueueItem 函数
  - source/public/styles.css：添加按钮样式
  - chrome-extension/：同步修改
- 验收标准：
  - [ ] 每个待确认岗位卡片都有"打开岗位"按钮
  - [ ] 点击按钮在新标签页打开岗位链接
  - [ ] 无岗位链接时按钮不显示或禁用
  - [ ] 构建通过
- 检查命令：`npm run build`
- 暂不处理：不改变投递任务进度卡片的布局

### 阶段 4｜AI 流程分析与提示词优化方案

- 目标：分析现有 AI 调用流程，给出提示词优化建议（仅分析和建议，不修改代码）
- 范围：
  - 分析 buildProfile（职业画像生成）提示词
  - 分析 analyzeJob（岗位匹配分析）提示词
  - 分析 TEST_AI 连接测试提示词
  - 输出优化方案文档
- 验收标准：
  - [ ] 已分析所有 AI 提示词调用点
  - [ ] 已给出具体优化建议
  - [ ] 优化建议写入 AI_IMPLEMENTATION_PLAN.md 的阶段历史
- 检查命令：无需代码检查（纯分析阶段）
- 暂不处理：不修改提示词代码

## 旧任务阶段详细记录（已归档）

### 目标

从项目中彻底移除 OpenClaw/桌面桥接相关所有代码、页面、文件和引用。

### 允许修改

- `source/src/background.js`
- `source/src/sidepanel.js`
- `source/public/sidepanel.html`
- `source/public/manifest.json`
- `source/tests/validate.mjs`
- `chrome-extension/`（构建产物，与 source 同步）
- `desktop-bridge/`（删除整个目录）
- `skills/jobclaw/`（删除整个目录）

### 实施任务

1. 删除 `desktop-bridge/` 目录
2. 删除 `skills/jobclaw/` 目录
3. 修改 `source/src/background.js`：移除 BRIDGE_ENDPOINTS、bridge 函数、handleBridgeCommands、writeEvent 中的 bridge 调用、BRIDGE_STATUS/BRIDGE_REPORT/BRIDGE_COMMAND 消息处理、PARSE_RESUME 中的 bridge 调用
4. 修改 `source/src/sidepanel.js`：移除 OpenClaw 页面标签、bridge 检测/命令/日报函数、PDF 增强识别 bridge 引用
5. 修改 `source/public/sidepanel.html`：移除 OpenClaw 页面 section 和底部导航按钮
6. 修改 `source/public/manifest.json`：移除 description 中的 "OpenClaw"、移除 localhost host_permissions
7. 修改 `source/tests/validate.mjs`：移除 openclaw 页面预期
8. 运行 `npm run build` 同步 chrome-extension/
9. 运行 `npm run test:unit` 验证

### 验收标准

- [ ] 所有 OpenClaw 相关代码已移除
- [ ] sidepanel 导航从 5 个减少到 4 个（首页、简历、消息、设置）
- [ ] desktop-bridge/ 目录已删除
- [ ] skills/jobclaw/ 目录已删除
- [ ] 构建产物与源码一致
- [ ] 测试通过

### 检查命令

```bash
npm run build
npm run test:unit
```

### 禁止事项

- 不修改 docs/ 目录下的文档文件
- 不修改 content-v37.js、common.js 等与 OpenClaw 无关的文件
- 不修改 AI 提示词
- 不自动提交或推送代码
- 不提前实现后续阶段

## 阶段历史

### 阶段 1｜移除 OpenClaw 相关内容

- 状态：已完成
- 完成内容：
  - 删除 `desktop-bridge/` 和 `skills/jobclaw/` 目录
  - 移除 `background.js` 中 BRIDGE_ENDPOINTS、bridge 函数、handleBridgeCommands、bridge 消息处理
  - 移除 `sidepanel.js` 中 OpenClaw 页面导航、bridge 检测/命令/日报函数
  - 移除 `sidepanel.html` 中 OpenClaw 页面和导航按钮
  - 移除 `manifest.json` 中 "OpenClaw" 描述和 localhost 权限
  - 更新 `validate.mjs` 测试用例
- 验证结果：build 通过，unit test 通过
- 遗留问题：无

### 阶段 2｜安装 Hallmark Skill 并优化界面

- 状态：已完成
- 完成内容：
  - 在 `skills/hallmark/` 创建 SKILL.md 和 references/ 目录
  - 将 CSS 变量从 hex/HSL 迁移到 OKLCH 色彩空间（teal 锚点色相 185）
  - 移除 AI 生成痕迹：brand-mark 渐变改为纯色、task-card 装饰圆和渐变背景
  - 简化阴影系统，降低视觉噪音
  - 导航栏从 5 列改为 4 列
  - 移除已删除的 bridge-hero/control-grid CSS
- 验证结果：build 通过
- 遗留问题：无

### 阶段 3｜消息页面"待确认岗位"卡片添加"打开岗位"按钮

- 状态：已完成
- 完成内容：
  - 在 `createQueueItem` 函数中添加"打开岗位"按钮
  - 按钮通过 `OPEN_TASK_JOB` 消息在新标签页打开岗位
  - 无岗位 URL 时按钮不显示
  - 添加 `.queue-open-job` CSS 样式
- 验证结果：build 通过
- 遗留问题：无

### 阶段 4｜AI 流程分析与提示词优化方案

- 状态：已完成
- 完成内容：
  - 分析了 4 个 AI 调用点：buildProfile（首次+重试）、analyzeJob、TEST_AI
  - 识别 6 类问题：prompt 过载、负向指令过多、缺少 few-shot、中英混合、评分标准模糊、token 效率低
  - 给出 5 类优化建议：结构化分层、评分 rubric、招呼语正向引导、token 优化、重试策略改进
- 验证结果：纯分析，无需代码检查
- 遗留问题：优化建议待用户确认后实施
