import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const content = await readFile(new URL('../src/content-v37.js', import.meta.url), 'utf8');
const processSearch = content.match(/async function processSearch\(state\) \{([\s\S]*?)\n\}\n\nasync function run\(\)/)?.[1] || '';
const domCollectionLoop = processSearch.slice(processSearch.indexOf('let index ='));

assert.ok(processSearch, '应能定位岗位搜索主流程');
assert.doesNotMatch(
  domCollectionLoop,
  /const ai = await send\('AI_JOB', \{ job \}\)/,
  '当前岗位处理仍在 DOM 采集循环中等待 AI 完整返回，下一岗位无法提前采集'
);
assert.match(
  processSearch,
  /createBoundedTaskPool\(2\)/,
  '岗位分析流水线必须显式限制为最多 2 路 AI'
);
assert.match(
  processSearch,
  /await analysisPool\.waitForSlot\(\)[\s\S]*?adapter\.openCard\(card\)[\s\S]*?analysisPool\.start\(/,
  'DOM 采集必须保持单路，并在有空闲 AI 槽位后才打开下一岗位'
);
assert.equal(
  (domCollectionLoop.match(/adapter\.openCard\(card\)/g) || []).length,
  1,
  'BOSS 岗位详情只能由单一 DOM 采集循环打开'
);
assert.match(
  processSearch,
  /const externalApplication = adapter\.externalApplicationInfo\(\)[\s\S]*?if \(externalApplication\)[\s\S]*?continue;[\s\S]*?analysisPool\.start\(/,
  '外部网申岗位必须在进入 AI 流水线前跳过'
);
assert.match(
  processSearch,
  /processed\.add\(key\)[\s\S]*?processedKeys: \[\.\.\.processed\][\s\S]*?analysisPool\.start\(/,
  '岗位必须在进入 AI 流水线前保存 processedKeys 与采集进度'
);
for (const contract of [
  /if \(hasVerification\(\)\) \{[\s\S]*?pauseForVerification\(\)[\s\S]*?analysisPool\.drain\(\)/,
  /workflow\?\.paused \|\| !latest\.state\.workflow\?\.running\) \{[\s\S]*?analysisPool\.drain\(\)/,
  /stats\?\.sent[\s\S]*?dailyTarget[\s\S]*?analysisPool\.drain\(\)/
]) {
  assert.match(processSearch, contract, '暂停、停止、安全验证与每日目标分支必须安全收敛在途分析');
}
assert.match(
  processSearch,
  /queueDepth >= 5 && !autoDispatchRequested[\s\S]*?autoDispatchRequested = true;[\s\S]*?send\('AUTO_DISPATCH_NEXT'\)/,
  '并行分析完成时自动排序投递仍必须保持单次调度'
);
assert.match(
  processSearch,
  /await analysisPool\.drain\(\)/,
  '离开搜索流程前必须等待已采集岗位分析收敛'
);

const poolSource = content.match(/function createBoundedTaskPool\(limit = 2\) \{([\s\S]*?)\n\}/)?.[0] || '';
assert.ok(poolSource, '缺少有界任务池实现');
const createBoundedTaskPool = vm.runInNewContext(`(${poolSource})`);
const pool = createBoundedTaskPool(2);
let active = 0;
let maxActive = 0;
const releases = [];

for (let index = 0; index < 2; index += 1) {
  await pool.waitForSlot();
  pool.start(async () => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    await new Promise(resolve => releases.push(resolve));
    active -= 1;
  });
}

await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(maxActive, 2, '第三路 AI 不得在前两路占满时启动');
let thirdSlotReady = false;
const thirdSlot = pool.waitForSlot().then(() => {
  thirdSlotReady = true;
  pool.start(async () => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    active -= 1;
  });
});
await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(thirdSlotReady, false, '两路 AI 占满时第三路必须等待');
releases.shift()?.();
await thirdSlot;
assert.equal(maxActive, 2, 'AI 并发数不得超过 2');
releases.splice(0).forEach(resolve => resolve());
await pool.drain();
assert.equal(active, 0, '任务池 drain 后不应残留分析任务');

console.log('UI40 bounded job analysis pipeline contracts passed');
