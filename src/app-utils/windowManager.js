import path from 'path';
import { BrowserWindow } from 'electron';
import { setWindowControls } from '../ipc-handlers/setWindowControls.js';
import { setStaticDataHandlers } from '../ipc-handlers/setStaticDataHandlers.js';
import {
    setSetupDataHanlders,
    unsetSetupDataHandlers,
} from '../ipc-handlers/setSetupDataHandlers.js';
import { setupTray } from './setupTray.js';
import { ROOT_DIR } from '../../main.js';

let setupWindow;
let mainWindow;

const createSetupWindow = () => {
    setupWindow = new BrowserWindow({
        width: 300,
        height: 240,
        frame: false,
        webPreferences: {
            preload: path.join(ROOT_DIR, 'preload.js'),
        },
    });

    setupWindow.loadURL('http://localhost:3000/setup');
    setupWindow.setMenuBarVisibility(false);

    setWindowControls(setupWindow);
    setSetupDataHanlders();

    return setupWindow;
};

const closeSetupWindow = () => {
    if (setupWindow !== null) {
        unsetSetupDataHandlers();
        setupWindow.close();
        setupWindow = null;
    }
};

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 725,
        // width: 1000,
        height: 500,
        minWidth: 725,
        minHeight: 500,
        frame: false,
        webPreferences: {
            preload: path.join(ROOT_DIR, 'preload.js'),
        },
    });

    mainWindow.loadURL('http://localhost:3000/');
    // mainWindow.webContents.openDevTools();
    mainWindow.setMenuBarVisibility(false);

    setWindowControls(mainWindow);
    setStaticDataHandlers();

    setupTray(mainWindow);

    return mainWindow;
};

export { createSetupWindow, closeSetupWindow, createMainWindow };
