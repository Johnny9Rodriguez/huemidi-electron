import { app, BrowserWindow } from 'electron';
import path from 'path';
import { loadBridgeData } from '../bridge-utils/bridgeData.js';
import { setupTray } from './setupTray.js';
import { setWindowControls } from '../ipc-handlers/setWindowControls.js';
import { setStaticDataHandlers } from '../ipc-handlers/setStaticDataHandlers.js';

const createSetupWindow = (ROOT_DIR) => {
    const setupWindow = new BrowserWindow({
        width: 300,
        height: 400,
        frame: false,
        webPreferences: {
            preload: path.join(ROOT_DIR, 'preload.js'),
        },
    });

    setupWindow.loadURL('http://localhost:3000/setup');
    setupWindow.setMenuBarVisibility(false);
};

const createMainWindow = (ROOT_DIR) => {
    const mainWindow = new BrowserWindow({
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

    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.webContents.openDevTools();
    mainWindow.setMenuBarVisibility(false);

    return mainWindow;
};

const boot = (ROOT_DIR) => {
    loadBridgeData(ROOT_DIR);

    const setupWindow = createSetupWindow(ROOT_DIR);

    // const win = createMainWindow(ROOT_DIR);
    // setupTray(win);

    setWindowControls(app, setupWindow);
    setStaticDataHandlers();
};

export { boot };
