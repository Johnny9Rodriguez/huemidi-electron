import path from 'path';
import { BrowserWindow } from 'electron';
import { setWindowControls } from '../ipc-handlers/setWindowControls.js';
import {
    setStaticDataHandlers,
    unsetStaticDataHandlers,
} from '../ipc-handlers/setStaticDataHandlers.js';
import {
    setSettingsDataHandlers,
    unsetSettingsDataHandlers,
} from '../ipc-handlers/setSettingsDataHandlers.js';
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
            devTools: false,
        },
        icon: path.join(ROOT_DIR, 'public/images', 'logo-32.ico'),
    });

    // setupWindow.loadURL('http://localhost:3000/setup');
    setupWindow.loadURL(
        `file://${path.join(ROOT_DIR, 'build', 'index.html')}#/setup`
    );
    setupWindow.setMenuBarVisibility(false);
    setupWindow.setResizable(false);

    // Disable reload with Ctrl + R
    setupWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'r') {
            event.preventDefault();
        }
    });

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
            devTools: false,
        },
        icon: path.join(ROOT_DIR, 'public/images', 'logo-32.ico'),
    });

    // mainWindow.loadURL('http://localhost:3000/');
    mainWindow.loadURL(
        `file://${path.join(ROOT_DIR, 'build', 'index.html')}#/`
    );
    // mainWindow.webContents.openDevTools();
    mainWindow.setMenuBarVisibility(false);

    // Disable reload with Ctrl + R
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'r') {
            event.preventDefault();
        }
    });

    setWindowControls(mainWindow);
    setStaticDataHandlers();
    setSettingsDataHandlers();

    setupTray(mainWindow);

    return mainWindow;
};

const closeMainWindow = () => {
    if (mainWindow !== null) {
        unsetStaticDataHandlers();
        unsetSettingsDataHandlers();
        mainWindow.close();
        mainWindow = null;
    }
};

export {
    createSetupWindow,
    closeSetupWindow,
    createMainWindow,
    closeMainWindow,
};
