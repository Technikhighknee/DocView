import { describe, it } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';
import electron from 'electron';

function runElectron(appPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const useXvfb = !process.env.DISPLAY;
    const command = useXvfb ? 'xvfb-run' : (electron as unknown as string);
    const electronArgs = ['--no-sandbox', appPath];
    const args = useXvfb
      ? ['-a', electron as unknown as string, ...electronArgs]
      : electronArgs;
    const child = spawn(command, args, {
      env: { ...process.env, E2E_TEST: '1' },
      stdio: 'ignore'
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      code === 0 ? resolve() : reject(new Error(`Exit code ${code}`));
    });
  });
}

describe('e2e', () => {
  it('loads renderer without errors', async () => {
    const main = path.join(__dirname, '../dist/electron-main/main.js');
    await runElectron(main);
  }, 20000);
});
