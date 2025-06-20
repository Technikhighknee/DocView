import fs from 'fs/promises';
import path from 'path';

export class FileService {
  constructor(private root: string) {}

  private resolveSafe(p: string) {
    const resolved = path.resolve(this.root, p);
    if (!resolved.startsWith(this.root)) {
      throw new Error('Path outside of root');
    }
    return resolved;
  }

  async readFile(p: string) {
    const full = this.resolveSafe(p);
    try {
      return await fs.readFile(full, 'utf-8');
    } catch (err: any) {
      throw new Error(`Failed to read file ${p}: ${err.message}`);
    }
  }
}
