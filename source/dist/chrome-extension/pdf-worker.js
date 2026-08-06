import { extractPdfText } from './pdf-extractor.js';

self.onmessage = async event => {
  const { id, arrayBuffer } = event.data || {};
  if (!arrayBuffer) return;
  try {
    const result = await extractPdfText(arrayBuffer);
    self.postMessage({ id, ok: true, result });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || String(error) });
  }
};
