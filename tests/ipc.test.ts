import { describe, it, expect } from 'vitest';
import { FileService } from '../shared/fileService';
import { parseMarkdown } from '../shared/markdownParser';
import fs from 'fs/promises';
import path from 'path';

describe('FileService and parser integration', () => {
  it('reads and parses markdown', async () => {
    const root = path.join(process.cwd(), 'tmp-ipc');
    await fs.mkdir(root, { recursive: true });
    await fs.writeFile(path.join(root, 'file.md'), '# Hello');
    const service = new FileService(root);
    const md = await service.readFile('file.md');
    const html = parseMarkdown(md);
    expect(html).toContain('<h1');
  });
});
