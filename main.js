import { app } from 'electron';
import { boot } from './src/app-utils/boot.js';
import { loadBridgeData } from './src/bridge-utils/bridgeData.js';

const ROOT_DIR = import.meta.dirname;

const instanceLock = app.requestSingleInstanceLock();

if (!instanceLock) app.quit();

app.whenReady().then(async () => {
    loadBridgeData();
    await boot();
});

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit();
});

export { ROOT_DIR };
