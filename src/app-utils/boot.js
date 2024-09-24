import { loadBridgeData } from '../bridge-utils/bridgeData.js';
import { discoverBridge } from '../bridge-utils/bridgeSetup.js';
import { createMainWindow, createSetupWindow } from './windowManager.js';

const setupBridge = () => {
    const setupWindow = createSetupWindow();
    discoverBridge(setupWindow);
};

const boot = async () => {
    const bridgeData = await loadBridgeData();

    if (!bridgeData) {
        setupBridge();
    } else {
        createMainWindow();
    }
};

export { boot, discoverBridge };
