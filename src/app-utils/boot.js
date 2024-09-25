import { verifyBridgeData } from '../bridge-utils/bridgeData.js';
import { discoverBridge } from '../bridge-utils/bridgeSetup.js';
import { createMainWindow, createSetupWindow } from './windowManager.js';

const setupBridge = () => {
    const setupWindow = createSetupWindow();
    discoverBridge(setupWindow);
};

const boot = async () => {
    const isValidBridgeData = await verifyBridgeData();

    if (!isValidBridgeData) {
        setupBridge();
    } else {
        createMainWindow();
    }
};

export { boot, discoverBridge };
