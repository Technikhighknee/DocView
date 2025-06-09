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
const welcome = document.getElementById('welcome')!;
const openButton = document.getElementById('open-folder')! as HTMLButtonElement;

let currentRoot: string | null = null;
let activeLink: HTMLElement | null = null;

function setActive(el: HTMLElement) {
  if (activeLink) activeLink.classList.remove('bg-gray-800', 'border-l-4', 'border-blue-500');
  activeLink = el;
  activeLink.classList.add('bg-gray-800', 'border-l-4', 'border-blue-500');
}

function renderNode(node: TreeNode): HTMLElement {
  if (node.type === 'directory') {
    const container = document.createElement('div');
    const header = document.createElement('div');
    header.classList.add('cursor-pointer', 'select-none', 'flex', 'items-center', 'py-1', 'pl-2', 'hover:bg-gray-800');
    const icon = document.createElement('span');
    icon.textContent = '▸';
    icon.classList.add('mr-1', 'transition-transform');
    header.appendChild(icon);
    const name = document.createElement('span');
    name.textContent = node.name;
    header.appendChild(name);

    const childrenEl = document.createElement('div');
    childrenEl.classList.add('ml-4', 'hidden');
    for (const child of node.children) {
      childrenEl.appendChild(renderNode(child));
    }

    header.onclick = () => {
      const hidden = childrenEl.classList.toggle('hidden');
      icon.style.transform = hidden ? '' : 'rotate(90deg)';
    };

    container.appendChild(header);
    container.appendChild(childrenEl);
    return container;
  }

  const link = document.createElement('a');
  link.textContent = node.name.replace(/\.md$/i, '');
  link.href = '#';
  link.dataset.path = node.path;
  link.classList.add('block', 'pl-6', 'py-1', 'hover:bg-gray-800');
  link.onclick = (e) => {
    e.preventDefault();
    setActive(link);
    loadFile(node.path);
  };
  return link;
}

function renderTree(tree: DirNode) {
  sidebar.innerHTML = '';
  for (const child of tree.children) {
    sidebar.appendChild(renderNode(child));
  }
}

async function loadFile(p: string) {
  if (!currentRoot) return;
  const html = await api.readFile(p);
  content.innerHTML = html;
  welcome.classList.add('hidden');
  content.classList.remove('hidden');
}

function findFirstFile(node: DirNode): FileNode | null {
  if (node.entryFile) return node.entryFile;
  for (const child of node.children) {
    if (child.type === 'directory') {
      const found = findFirstFile(child);
      if (found) return found;
    } else if (child.type === 'file') {
      return child;
    }
  }
  return null;
}

async function chooseFolder() {
  const result = await api.chooseRoot();
  if (!result) return;
  currentRoot = result.root;
  renderTree(result.tree);
  const first = findFirstFile(result.tree);
  if (first) {
    const link = sidebar.querySelector(`[data-path="${first.path}"]`) as HTMLElement;
    if (link) setActive(link);
    loadFile(first.path);
  }
}

openButton.addEventListener('click', chooseFolder);
