export interface FileNode {
  type: 'file';
  name: string;
  path: string;
}

export interface DirNode {
  type: 'directory';
  name: string;
  path: string;
  children: Node[];
  entryFile?: FileNode;
}

export type Node = FileNode | DirNode;
