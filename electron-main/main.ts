import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'path';
import { walkDirectory } from '../shared/directoryWalker';
import { FileService } from '../shared/fileService';
import { parseMarkdown } from '../shared/markdownParser';

let mainWindow: BrowserWindow | null = null;
let fileService: FileService | null = null;
let rootPath: string | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  mainWindow.webContents.once('did-fail-load', (_e, code, desc) => {
    console.error('Load failed', code, desc);
    if (process.env.E2E_TEST) app.exit(1);
  });
  mainWindow.webContents.once('did-finish-load', () => {
    if (process.env.E2E_TEST) {
      setTimeout(() => app.exit(0), 500);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('chooseRoot', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled || result.filePaths.length === 0) return null;
  rootPath = result.filePaths[0];
  fileService = new FileService(rootPath);
  const tree = await walkDirectory(rootPath);
  return { root: rootPath, tree };
});

ipcMain.handle('readFile', async (_e, filePath: string) => {
  if (!fileService) throw new Error('Root not selected');
  const md = await fileService.readFile(filePath);
  const html = parseMarkdown(md);
  return html;
});

ipcMain.handle('openExternal', async (_e, url: string) => {
  await shell.openExternal(url);
});
