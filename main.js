import { app, BrowserWindow } from 'electron';
import path from 'path';
import { loadBridgeData } from './src/bridge-utils/bridgeData.js';
import { setupTray } from './src/app-utils/setupTray.js';
import { setWindowControls } from './src/ipc-handlers/setWindowControls.js';
import { setStaticDataHandlers } from './src/ipc-handlers/setStaticDataHandlers.js';

const ROOT_DIR = import.meta.dirname;

const createWindow = () => {
    const win = new BrowserWindow({
        // width: 725,
        width: 1000,
        height: 500,
        minWidth: 725,
        minHeight: 500,
        frame: false,
        webPreferences: {
            preload: path.join(ROOT_DIR, 'preload.js'),
        },
    });

    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
    win.setMenuBarVisibility(false);

    return win;
};

app.whenReady().then(async () => {
    loadBridgeData(ROOT_DIR);

    const win = createWindow();
    setupTray(win);

    setWindowControls(app, win);
    setStaticDataHandlers();
});

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit();
});

// TODO: delete and implement SSL auth
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
