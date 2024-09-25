import { ipcMain } from 'electron';
import { getBridgeData } from '../bridge-utils/bridgeData.js';

const setSettingsDataHandlers = () => {
    ipcMain.handle('fetch-bridge-data', async () => {
        return await getBridgeData();
    });
};

export { setSettingsDataHandlers };
