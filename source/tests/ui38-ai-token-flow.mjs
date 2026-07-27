import { readFile } from 'node:fs/promises';

const background = await readFile('src/background.js', 'utf8');
const common = await readFile('src/common.js', 'utf8');
const sidepanel = await readFile('src/sidepanel.js', 'utf8');
const html = await readFile('public/sidepanel.html', 'utf8');

const analyzeStart = background.indexOf('async function analyzeJob(job)');
const analyzeEnd = background.indexOf('function createTasks(', analyzeStart);
if (analyzeStart < 0 || analyzeEnd < 0) throw new Error('岗位匹配函数缺失');
const analyzeBody = background.slice(analyzeStart, analyzeEnd);

for (const token of ['buildJobMatchProfile', 'profileFacts', 'matchedSkills', '"score":0', '"decision":"recommend|cautious|reject"', 'maxTokens: 900']) {
  if (!analyzeBody.includes(token)) throw new Error(`岗位匹配精简输入/输出缺失：${token}`);
}
for (const forbidden of ['resumeText', '"greeting"', 'normalizeApplicantGreeting']) {
  if (analyzeBody.includes(forbidden)) throw new Error(`岗位匹配仍包含高消耗或招呼语逻辑：${forbidden}`);
}

for (const token of [
  'async function hashResumeText',
  'normalizeProfileFacts',
  'ensureProfileFacts',
  'profileFacts',
  'resumeHash'
]) {
  if (!background.includes(token) && !common.includes(token)) throw new Error(`简历结构化缓存缺失：${token}`);
}

for (const token of [
  'async function generateApplicantGreeting',
  'normalizeApplicantGreeting',
  'ensurePendingGreeting',
  'await ensurePendingGreeting(candidate)',
  'await ensurePendingGreeting(item, greeting)',
  '默认安全规则和输出格式优先级最高',
  'customInstruction',
  'customPrompt'
]) {
  if (!background.includes(token)) throw new Error(`独立招呼语生成或安全边界缺失：${token}`);
}

if (!common.includes("customInstruction: ''") || !common.includes("customPrompt: ''")) {
  throw new Error('自定义 AI 指令默认字段缺失');
}
if (!html.includes('id="customInstruction"') || !sidepanel.includes("'customInstruction'")) {
  throw new Error('设置页自定义 AI 指令字段缺失');
}

console.log(JSON.stringify({
  ok: true,
  jobMatchInput: ['CAREER_PROFILE', 'SKILLS', 'PROJECT_SUMMARIES', 'JOB'],
  fullResumeExcluded: true,
  greetingDeferred: true,
  cache: ['profileFacts', 'resumeHash'],
  customInstructionSafety: 'DEFAULT_RULES_OVERRIDE_USER'
}, null, 2));
