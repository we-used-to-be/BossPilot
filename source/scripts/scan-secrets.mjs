import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = '..';
const excludedDirs = new Set(['.git', 'node_modules']);
const allowedExtensions = new Set([
  '.js', '.mjs', '.json', '.html', '.css', '.md', '.txt', '.toml', '.lock',
  '.yml', '.yaml', '.command', '.swift'
]);
const envFilePattern = /^\.env(?:\..*)?$/i;
const structuredHashPattern = /["']?(?:sha1|sha256|sha384|sha512|hash)["']?\s*:\s*["'][a-f0-9]{40,128}["']/gi;
const findings = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (excludedDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (allowedExtensions.has(path.extname(entry.name).toLowerCase()) || envFilePattern.test(entry.name)) {
      const text = await readFile(full, 'utf8').catch(() => '');
      const checks = [
        ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
        ['openai-api-key', /\bsk-[A-Za-z0-9_-]{20,}\b/],
        ['github-token', /\b(?:ghp|gho|ghs|ghr|github_pat)_[A-Za-z0-9_]{20,}\b/],
        ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/],
        ['google-api-key', /\bAIza[0-9A-Za-z_-]{30,}\b/],
        ['bearer-token', /Authorization\s*[:=]\s*["'`]Bearer\s+[A-Za-z0-9._-]{20,}/i],
        ['personal-email', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
        ['personal-phone', /(?:\+?86[\s-]?)?1[3-9]\d{9}/]
      ];
      const textWithoutHashes = text.replace(structuredHashPattern, '[STRUCTURED_HASH_REDACTED]');
      for (const [name, pattern] of checks) {
        if (pattern.test(name === 'personal-email' || name === 'personal-phone' ? textWithoutHashes : text)) {
          findings.push(`${name}: ${path.relative(root, full)}`);
        }
      }
    }
  }
}

await walk(root);
if (findings.length) {
  console.error('SECRET_SCAN_FAILED');
  for (const item of findings) console.error(`- ${item}`);
  process.exit(1);
}
console.log('SECRET_SCAN_OK');
