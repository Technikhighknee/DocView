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
const openBtn = document.createElement('button');
openBtn.textContent = 'Open Folder';
openBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded';
openBtn.onclick = () => chooseFolder();

let currentRoot: string | null = null;
let activeEl: HTMLElement | null = null;

function showWelcome() {
  content.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'h-full flex flex-col items-center justify-center space-y-4';
  const msg = document.createElement('p');
  msg.textContent = 'Select folder to begin viewing your Markdown documentation';
  wrap.appendChild(msg);
  wrap.appendChild(openBtn);
  content.appendChild(wrap);
}

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
        if (activeEl) activeEl.classList.remove('bg-[#2c2c2c]', 'border-l-4', 'border-blue-500');
        a.classList.add('bg-[#2c2c2c]', 'border-l-4', 'border-blue-500');
        activeEl = a;
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

showWelcome();
