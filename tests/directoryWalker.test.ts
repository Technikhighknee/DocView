import { describe, it, expect, beforeAll } from 'vitest';
import { walkDirectory } from '../shared/directoryWalker';
import fs from 'fs/promises';
import path from 'path';

let tempDir: string;

beforeAll(async () => {
  tempDir = path.join(process.cwd(), 'tmp-test');
  await fs.rm(tempDir, { recursive: true, force: true });
  await fs.mkdir(tempDir, { recursive: true });
  await fs.writeFile(path.join(tempDir, 'readme.md'), '# Root');
  await fs.mkdir(path.join(tempDir, 'sub'));
  await fs.writeFile(path.join(tempDir, 'sub', 'index.md'), '# Sub');
});

describe('walkDirectory', () => {
  it('builds tree with entry files', async () => {
    const tree = await walkDirectory(tempDir);
    expect(tree.entryFile?.name).toBe('readme.md');
    const sub = tree.children.find(c => (c as any).name === 'sub') as any;
    expect(sub.entryFile?.name).toBe('index.md');
  });
});
