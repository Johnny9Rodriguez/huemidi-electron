import { ipcMain } from 'electron';
import { getBridgeData } from '../bridge-utils/bridgeData.js';
import { forgetBridge } from '../app-utils/boot.js';

const setSettingsDataHandlers = () => {
    ipcMain.handle('fetch-bridge-data', async () => {
        return await getBridgeData();
    });
    ipcMain.on('forget-bridge', () => {
        forgetBridge();
    });
};

const unsetSettingsDataHandlers = () => {
    ipcMain.removeHandler('fetch-bridge-data');
    ipcMain.removeAllListeners('forget-bridge');
};

export { setSettingsDataHandlers, unsetSettingsDataHandlers };
