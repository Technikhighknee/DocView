interface API {
  chooseRoot(): Promise<{ root: string; tree: DirNode } | null>;
  readFile(path: string): Promise<string>;
}

declare const api: API;

interface FileNode { type: 'file'; name: string; path: string; }
interface DirNode { type: 'directory'; name: string; path: string; children: TreeNode[]; entryFile?: FileNode; }
type TreeNode = FileNode | DirNode;

const sidebar = document.getElementById('sidebar')!;
const content = document.getElementById('content')!;

let currentRoot: string | null = null;

function renderTree(node: DirNode) {
  const ul = document.createElement('ul');
  for (const child of node.children) {
    const li = document.createElement('li');
    if (child.type === 'directory') {
      li.textContent = child.name;
      li.classList.add('font-bold', 'cursor-pointer');
      li.onclick = () => {
        li.appendChild(renderTree(child));
        li.onclick = null;
        if (child.entryFile) loadFile(child.entryFile.path);
      };
    } else {
      const a = document.createElement('a');
      a.textContent = child.name;
      a.href = '#';
      a.onclick = (e) => {
        e.preventDefault();
        loadFile(child.path);
      };
      li.appendChild(a);
    }
    ul.appendChild(li);
  }
  return ul;
}

async function loadFile(p: string) {
  if (!currentRoot) return;
  const html = await api.readFile(p);
  content.innerHTML = html;
}

async function chooseFolder() {
  const result = await api.chooseRoot();
  if (!result) return;
  currentRoot = result.root;
  sidebar.innerHTML = '';
  sidebar.appendChild(renderTree(result.tree));
  if (result.tree.entryFile) loadFile(result.tree.entryFile.path);
}

chooseFolder();
