import {
    verifyBridgeData,
    deleteBridgeData,
} from '../bridge-utils/bridgeData.js';
import { discoverBridge } from '../bridge-utils/bridgeSetup.js';
import {
    createMainWindow,
    createSetupWindow,
    closeMainWindow,
} from './windowManager.js';

const setupBridge = () => {
    const setupWindow = createSetupWindow();
    discoverBridge(setupWindow);
};

const forgetBridge = () => {
    closeMainWindow();
    deleteBridgeData();
    setupBridge();
};

const boot = async () => {
    const isValidBridgeData = await verifyBridgeData();

    if (!isValidBridgeData) {
        setupBridge();
    } else {
        createMainWindow();
    }
};

export { boot, discoverBridge, forgetBridge };
