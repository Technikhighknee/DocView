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
let activeEl: HTMLElement | null = null;
const elementMap = new Map<string, HTMLElement>();

function showWelcome() {
  sidebar.innerHTML = '';
  content.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-center">
      <p class="mb-4">Select folder to begin viewing your Markdown documentation</p>
      <button id="open-btn" class="px-4 py-2 bg-blue-600 text-white rounded">Open Folder</button>
    </div>`;
  document.getElementById('open-btn')!.addEventListener('click', chooseFolder);
}

function createFile(child: FileNode) {
  const li = document.createElement('li');
  li.dataset.path = child.path;
  const a = document.createElement('a');
  a.textContent = child.name.replace(/\.md$/i, '');
  a.href = '#';
  a.className = 'block p-1 pl-6 hover:bg-[#2c2c2c]';
  a.onclick = (e) => {
    e.preventDefault();
    loadFile(child.path, li);
  };
  li.appendChild(a);
  elementMap.set(child.path, li);
  return li;
}

function createDir(node: DirNode) {
  const li = document.createElement('li');
  const header = document.createElement('div');
  header.className = 'cursor-pointer flex items-center p-1 hover:bg-[#2c2c2c]';
  const arrow = document.createElement('span');
  arrow.textContent = node.children.length ? '▶' : '';
  arrow.className = 'mr-1 transition-transform';
  header.appendChild(arrow);
  const text = document.createElement('span');
  text.textContent = node.name;
  header.appendChild(text);
  li.appendChild(header);

  const ul = document.createElement('ul');
  ul.className = 'ml-4 hidden';
  for (const child of node.children) {
    ul.appendChild(child.type === 'directory' ? createDir(child) : createFile(child));
  }
  li.appendChild(ul);

  header.onclick = () => {
    const open = ul.classList.toggle('hidden');
    arrow.style.transform = open ? 'rotate(90deg)' : '';
  };

  return li;
}

function renderTree(node: DirNode) {
  const ul = document.createElement('ul');
  for (const child of node.children) {
    ul.appendChild(child.type === 'directory' ? createDir(child) : createFile(child));
  }
  return ul;
}

async function loadFile(p: string, el?: HTMLElement) {
  if (!currentRoot) return;
  const html = await api.readFile(p);
  content.innerHTML = html;
  if (activeEl) activeEl.classList.remove('active');
  if (el) {
    el.classList.add('active');
    activeEl = el;
  } else {
    const maybe = elementMap.get(p);
    if (maybe) {
      maybe.classList.add('active');
      activeEl = maybe;
    }
  }
}

async function chooseFolder() {
  const result = await api.chooseRoot();
  if (!result) return;
  currentRoot = result.root;
  sidebar.innerHTML = '';
  elementMap.clear();
  const treeEl = renderTree(result.tree);
  sidebar.appendChild(treeEl);
  if (result.tree.entryFile) loadFile(result.tree.entryFile.path);
}

showWelcome();
