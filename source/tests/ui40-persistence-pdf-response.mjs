import { readFile } from 'node:fs/promises';

const [background, sidepanel, build] = await Promise.all([
  readFile(new URL('../src/background.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/sidepanel.js', import.meta.url), 'utf8'),
  readFile(new URL('../build.mjs', import.meta.url), 'utf8')
]);

for (const token of [
  'SEARCH_PROGRESS_WRITE_DELAY_MS',
  'queueSearchTaskProgress',
  'JOB_CACHE_MAX_ENTRIES',
  'pruneJobCache',
  'writeJobCacheEntry'
]) {
  if (!background.includes(token)) throw new Error(`阶段 3 持久化契约缺少：${token}`);
}

const pruneStart = background.indexOf('function pruneJobCache');
const pruneEnd = background.indexOf('async function writeJobCacheEntry', pruneStart);
const pruneJobCache = new Function(
  'JOB_CACHE_MAX_ENTRIES',
  `${background.slice(pruneStart, pruneEnd)}; return pruneJobCache;`
)(200);
const oversizedCache = Object.fromEntries(Array.from({ length: 205 }, (_, index) => [`job-${index}`, { score: index }]));
const boundedCache = pruneJobCache(oversizedCache);
if (Object.keys(boundedCache).length !== 200 || boundedCache['job-0'] || boundedCache['job-204']?.score !== 204) {
  throw new Error('岗位缓存未保留最近 200 条兼容对象');
}

const queueStart = background.indexOf('function searchProgressKey');
const queueEnd = background.indexOf('async function retryFailedTask', queueStart);
const persistedProgress = [];
const { queueSearchTaskProgress } = new Function(
  'SEARCH_PROGRESS_WRITE_DELAY_MS',
  'pendingSearchProgressWrites',
  'updateSearchTaskProgress',
  `${background.slice(queueStart, queueEnd)}; return { queueSearchTaskProgress };`
)(
  10,
  new Map(),
  async message => {
    persistedProgress.push(message);
    return message;
  }
);
await Promise.all([
  queueSearchTaskProgress({ taskId: 'task-1', status: 'running', progress: 20, processed: 1 }),
  queueSearchTaskProgress({ taskId: 'task-1', status: 'running', progress: 22, processed: 2 }),
  queueSearchTaskProgress({ taskId: 'task-1', status: 'running', progress: 24, processed: 3 })
]);
await new Promise(resolve => setTimeout(resolve, 25));
if (persistedProgress.length !== 1 || persistedProgress[0].processed !== 3) {
  throw new Error('非关键搜索进度未合并为最后一次写入');
}
await queueSearchTaskProgress({ taskId: 'task-1', status: 'completed', progress: 100, processed: 4 });
if (persistedProgress.length !== 2 || persistedProgress[1].status !== 'completed') {
  throw new Error('终态搜索进度未立即持久化');
}

for (const token of [
  'PDF_WORKER_MIN_BYTES',
  'extractPdfTextInWorker',
  "chrome.runtime.getURL('pdf-worker.js')",
  'worker.postMessage'
]) {
  if (!sidepanel.includes(token)) throw new Error(`阶段 3 PDF Worker 契约缺少：${token}`);
}
if (!build.includes("'pdf-worker.js'")) throw new Error('构建未包含 PDF Worker');

const posted = [];
globalThis.self = {
  postMessage(message) {
    posted.push(message);
  }
};
await import(new URL('../src/pdf-worker.js', import.meta.url).href + `?ui40=${Date.now()}`);

const content = 'BT /F1 12 Tf 72 720 Td (Experienced JavaScript engineer with browser extension and automation projects.) Tj ET';
const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${content.length} >>
stream
${content}
endstream
endobj
%%EOF`;
const buffer = new TextEncoder().encode(pdf).buffer;
await self.onmessage({ data: { id: 'ui40', arrayBuffer: buffer } });
const response = posted.find(item => item.id === 'ui40');
if (!response?.ok || !response.result?.text.includes('Experienced JavaScript engineer')) {
  throw new Error(response?.error || 'PDF Worker 未返回解析文本');
}

console.log(JSON.stringify({
  ok: true,
  boundedJobCache: true,
  coalescedProgressPersistence: true,
  pdfWorker: true
}, null, 2));
