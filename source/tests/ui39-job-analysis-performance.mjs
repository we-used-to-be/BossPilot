import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const background = await readFile(new URL('../src/background.js', import.meta.url), 'utf8');

assert.match(background, /function buildJobAnalysisInput\(job = \{\}\)/, '岗位分析应使用独立的精简输入构造器');
assert.match(
  background,
  /description:\s*String\(job\.description \|\| ''\)\.slice\(0,\s*3600\)/,
  '岗位正文应限制为 3600 字符'
);
assert.match(
  background,
  /岗位：\$\{JSON\.stringify\(buildJobAnalysisInput\(job\)\)\}/,
  '岗位匹配 Prompt 应只发送精简岗位输入'
);
assert.doesNotMatch(
  background,
  /岗位：\$\{JSON\.stringify\(job\)\}/,
  '岗位匹配 Prompt 不应发送完整岗位对象'
);
assert.match(
  background,
  /maxTokens:\s*aiMode === 'economy' \? 400 : 900,\s*requestType:\s*'job_analysis'/,
  '岗位匹配应使用 400/900 的专用输出上限'
);

for (const excluded of ['recruiterName', 'chatUrl', 'collectedAt']) {
  const builder = background.match(/function buildJobAnalysisInput\(job = \{\}\) \{([\s\S]*?)\n\}/)?.[1] || '';
  assert.ok(!builder.includes(excluded), `精简岗位输入不应包含 ${excluded}`);
}

console.log('UI39 job analysis performance contracts passed');
