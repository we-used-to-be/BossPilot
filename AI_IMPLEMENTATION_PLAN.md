# AI Implementation Plan

## 当前状态

- 当前阶段：阶段 3｜持久化与 PDF 响应优化
- 阶段状态：已完成
- 上次执行结果：
  - 250 ms 内非关键搜索进度合并写入，完成/失败/暂停终态立即持久化
  - 岗位缓存串行合并并限制为最近 200 条，旧版对象缓存无需迁移即可复用
  - 真实 PDF 基线超过主线程预算，≥256 KB 深度解析已迁移到模块 Worker，并保留兼容回退
  - 新增 UI40 持久化/PDF 响应回归，运行文件已精确同步且未运行破坏性构建
- 验证结果：
  - 基线：405 KB/5 页 PDF 暖态约 94 ms；3.09 MB/142 页 PDF 暖态约 1.51 s
  - `node tests/ui40-persistence-pdf-response.mjs`：通过
  - UI18 任务进度/重试、UI38 Token 流程、UI39 分析边界：通过
  - `node tests/validate.mjs`、`npm run check:syntax`、`npm run test:unit`：通过
  - 两份源码/`source/dist` 后台与侧栏脚本哈希分别一致，三份 PDF Worker 哈希一致
  - `git diff --check`：通过
  - `npm run build`：未执行；构建脚本会删除并重建已有用户修改的 `source/dist/`
- 本阶段剩余：无
- 本阶段允许修改：
  - `source/src/background.js`
  - `source/src/sidepanel.js`
  - `source/src/pdf-worker.js`
  - `source/build.mjs`
  - `source/tests/ui40-persistence-pdf-response.mjs`
  - `chrome-extension/` 与 `source/dist/chrome-extension/` 对应运行文件
  - `AI_IMPLEMENTATION_PLAN.md`
- 阻塞问题：无
- 下一阶段：无（阶段 3 完成后整体结束）

## 当前优化目标

提升批量岗位解析吞吐量，同时保持会话绑定、发送确认、附件顺序、外部网申跳过和反误投逻辑不变。

### 阶段 1｜岗位分析输入与输出边界

- 只向岗位匹配模型发送评分必需字段，限制 JD 正文长度。
- 平衡/精准模式的岗位匹配输出上限不超过 900 token。
- 保留现有六字段匹配结果和 AI 耗时记录。

### 阶段 2｜有界岗位分析流水线

- 在不并发操作 BOSS DOM 的前提下，将已提取岗位交给最多 2 路 AI 分析。
- 保持队列排序、自动投递和安全暂停语义。

### 阶段 3｜持久化与 PDF 响应优化

- 合并非关键进度写入并限制岗位缓存增长。
- 根据真实 PDF 基线决定是否将深度解析迁移到 Worker。

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
  - [x] 岗位匹配 Prompt 不含完整简历与 greeting 字段。
  - [x] 匹配结果稳定返回六个约定字段。
  - [x] `profileFacts`、`resumeHash` 本地保存，简历变化时缓存失效并重建。
  - [x] 招呼语仅在投递确认/自动投递/重试入口生成。
  - [x] 自定义要求可影响招呼语，但不能覆盖安全规则和 JSON 输出格式。
  - [x] 原有发送安全、队列排序、会话绑定与附件顺序定向回归通过。
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

### 目标

基于真实持久化与 PDF 响应基线，完成可测量、向后兼容的最小优化。

### 允许修改

- `source/src/background.js`
- `source/src/sidepanel.js`
- `source/src/pdf-worker.js`
- `source/build.mjs`
- `source/tests/ui40-persistence-pdf-response.mjs`
- `chrome-extension/` 与 `source/dist/chrome-extension/` 对应运行文件
- `AI_IMPLEMENTATION_PLAN.md`

### 实施任务

1. 测量非关键进度写入频率、岗位缓存增长边界与真实 PDF 解析耗时。
2. 合并非关键搜索进度写入，终态保持立即持久化。
3. 限制岗位缓存增长，并串行合并并发写入，兼容旧缓存对象。
4. 将超过响应预算的 PDF 深度解析迁移到 Worker，保留原解析器回退。
5. 增加定向回归并精确同步构建产物。

### 验收标准

- [x] 连续非关键搜索进度合并，终态立即写入。
- [x] 岗位缓存最多保留最近 200 条，旧缓存无需清空或重建。
- [x] ≥256 KB PDF 在 Worker 中解析，失败时兼容回退。
- [x] 持久化、PDF、任务进度、Token 流程和语法定向验证通过。

### 禁止事项

- 不清空或重建现有配置、缓存和用户数据。
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

### 阶段 1｜岗位分析输入与输出边界

- 状态：已完成
- 完成内容：精简岗位匹配输入并限制 JD 为 3600 字符；岗位匹配输出限制为节省模式 400、其他模式 900 token；新增 UI39 性能边界契约。
- 验证结果：UI39、UI38、语法、单元测试和 4 项投递安全定向回归通过；UI9 为现有页面与旧契约不一致；构建因保护已有 `source/dist/` 修改未执行，三份后台文件已精确同步并通过语法检查。
- 遗留问题：真实模型延迟需在扩展实际运行后通过 `aiStats.records.durationMs` 对比；未宣称未测量的提速比例。

### 阶段 2｜有界岗位分析流水线

- 状态：已完成
- 完成内容：UI40 先红证明串行缺口；实现单路 BOSS DOM 采集与最多 2 路 AI 分析的有界流水线；保留外部网申跳过、进度、自动排序、暂停/停止、安全验证、每日目标及投递会话安全语义。
- 验证结果：UI24、UI30、UI40、语法、单元测试及 UI18/UI20/UI21/UI22 定向安全回归通过；三份内容脚本哈希一致；为保护已有 `source/dist/` 修改未运行构建。
- 遗留问题：无。

### 阶段 3｜持久化与 PDF 响应优化

- 状态：已完成
- 完成内容：合并 250 ms 内非关键搜索进度并即时保存终态；岗位缓存串行写入且保留最近 200 条；基于真实 PDF 基线将 ≥256 KB 深度解析迁移到 Worker，并保留兼容回退。
- 验证结果：UI40、UI18、UI38、UI39、validate、语法和单元测试通过；运行文件精确同步；`git diff --check` 通过；为保护已有 `source/dist/` 修改未运行构建。
- 遗留问题：真实浏览器中的交互帧延迟未做自动化采样；Worker 迁移依据为现有解析器在真实 PDF 上的耗时基线。

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

### 阶段 1｜AI Token 优化闭环

- 状态：已完成
- 完成内容：拆分岗位匹配与招呼语生成；增加结构化简历哈希缓存；收窄两类 Prompt；增加不可覆盖安全规则的自定义招呼语要求。
- 验证结果：新 Token 流程契约、投递/安全定向回归、语法、单元测试和构建通过。
- 遗留问题：额外全量回归中的 `ui28-profile-generation.mjs` 因旧 UI 改动缺少 `UI28 — profile source clarity` CSS 标记失败，与本阶段修改无关。
