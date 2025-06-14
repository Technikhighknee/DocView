import { contextBridge, ipcRenderer } from 'electron';
import type { DirNode } from '../shared/types';

contextBridge.exposeInMainWorld('api', {
  chooseRoot: async (): Promise<{ root: string; tree: DirNode } | null> => {
    return ipcRenderer.invoke('chooseRoot');
  },
  readFile: async (path: string): Promise<string> => {
    return ipcRenderer.invoke('readFile', path);
  },
  openExternal: async (url: string): Promise<void> => {
    return ipcRenderer.invoke('openExternal', url);
  },
});
