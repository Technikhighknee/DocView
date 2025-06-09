import { promises as fs, Dirent } from 'fs';
import path from 'path';
import { DirNode, FileNode, Node } from './types';

const ENTRY_NAMES = ['index.md', 'readme.md', 'doc.md'];

export async function walkDirectory(root: string, dir = '.'):
  Promise<DirNode> {
  const absDir = path.join(root, dir);
  let items: Dirent[] = [];
  try {
    items = await fs.readdir(absDir, { withFileTypes: true });
  } catch (err) {
    // return partial node if directory can't be read
    return {
      type: 'directory',
      name: path.basename(absDir),
      path: dir,
      children: [],
      entryFile: undefined,
    };
  }
  const children: Node[] = [];
  let entryFile: FileNode | undefined;

  for (const item of items) {
    if (item.name.startsWith('.')) continue;
    const relPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      const child = await walkDirectory(root, relPath);
      children.push(child);
    } else if (item.isFile() && item.name.toLowerCase().endsWith('.md')) {
      const fileNode: FileNode = { type: 'file', name: item.name, path: relPath };
      children.push(fileNode);
      if (ENTRY_NAMES.includes(item.name.toLowerCase()) && !entryFile) {
        entryFile = fileNode;
      }
    }
  }

  return {
    type: 'directory',
    name: path.basename(absDir),
    path: dir,
    children,
    entryFile,
  };
}
