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

const state = {
  tree: null as DirNode | null,
  openDirs: new Set<string>(),
  activeFile: ''
};

function render() {
  sidebar.innerHTML = '';
  if (!state.tree) {
    content.innerHTML = `<div class="h-full flex items-center justify-center"><button id="openBtn" class="px-4 py-2 bg-blue-600 text-white rounded">Open Folder</button></div>`;
    document.getElementById('openBtn')!.addEventListener('click', chooseFolder);
    return;
  }
  sidebar.appendChild(renderDir(state.tree, 0));
}

function renderDir(dir: DirNode, depth: number): HTMLElement {
  const container = document.createElement('div');
  if (depth) container.style.paddingLeft = `${depth * 16}px`;

  dir.children.forEach(child => {
    if (child.type === 'directory') {
      const header = document.createElement('div');
      header.className = 'cursor-pointer select-none flex items-center';
      const icon = document.createElement('span');
      icon.innerHTML = '&#9654;';
      icon.className = 'mr-1 transition-transform';
      if (state.openDirs.has(child.path)) icon.classList.add('rotate-90');
      header.appendChild(icon);
      const text = document.createElement('span');
      text.textContent = child.name;
      header.appendChild(text);
      header.onclick = () => {
        if (state.openDirs.has(child.path)) state.openDirs.delete(child.path);
        else state.openDirs.add(child.path);
        if (child.entryFile) state.activeFile = child.entryFile.path;
        render();
        if (child.entryFile) loadFile(child.entryFile.path);
      };
      container.appendChild(header);
      if (state.openDirs.has(child.path)) {
        container.appendChild(renderDir(child, depth + 1));
      }
    } else {
      const fileEl = document.createElement('div');
      fileEl.textContent = child.name.replace(/\.md$/i, '');
      fileEl.className = 'cursor-pointer pl-4';
      if (state.activeFile === child.path) fileEl.classList.add('active-file');
      fileEl.onclick = () => loadFile(child.path);
      container.appendChild(fileEl);
    }
  });
  return container;
}

async function loadFile(p: string) {
  const html = await api.readFile(p);
  state.activeFile = p;
  content.innerHTML = html;
  render();
}

async function chooseFolder() {
  const result = await api.chooseRoot();
  if (!result) return;
  state.tree = result.tree;
  state.openDirs = new Set([result.tree.path]);
  render();
  if (result.tree.entryFile) {
    await loadFile(result.tree.entryFile.path);
  } else {
    content.innerHTML = '';
  }
}

render();
