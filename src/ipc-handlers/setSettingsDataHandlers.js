import { ipcMain } from 'electron';
import { getBridgeData } from '../bridge-utils/bridgeData.js';
import { forgetBridge } from '../app-utils/boot.js';
import { store } from '../bridge-utils/bridgeData.js';

const setSettingsDataHandlers = () => {
    ipcMain.handle('fetch-bridge-data', async () => {
        return await getBridgeData();
    });
    ipcMain.on('forget-bridge', () => {
        forgetBridge();
    });
    ipcMain.handle('fetch-pref-group', async () => {
        return (await store.get('prefGroup')) || null;
    });
    ipcMain.on('update-pref-group', (_event, groupID) => {
        store.set('prefGroup', groupID);
    });
};

const unsetSettingsDataHandlers = () => {
    ipcMain.removeHandler('fetch-bridge-data');
    ipcMain.removeAllListeners('forget-bridge');
    ipcMain.removeHandler('fetch-pref-group');
    ipcMain.removeAllListeners('update-pref-group');
};

export { setSettingsDataHandlers, unsetSettingsDataHandlers };
