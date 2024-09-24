import { ipcMain } from 'electron';
import { discoverBridge } from '../app-utils/boot.js';
import { startLinking, stopLinking } from '../bridge-utils/bridgeLink.js';
import {
    closeSetupWindow,
    createMainWindow,
} from '../app-utils/windowManager.js';

const setSetupDataHanlders = () => {
    ipcMain.on('discover-bridge', () => {
        discoverBridge();
    });

    ipcMain.on('link-bridge', (_event, shouldLink) => {
        if (shouldLink) {
            startLinking();
        } else {
            stopLinking();
        }
    });

    ipcMain.on('close-setup', () => {
        closeSetupWindow();
        createMainWindow();
    });
};

const unsetSetupDataHandlers = () => {
    ipcMain.removeAllListeners('discover-bridge');
    ipcMain.removeAllListeners('link-bridge');
    ipcMain.removeAllListeners('close-setup');
};

export { setSetupDataHanlders, unsetSetupDataHandlers };
