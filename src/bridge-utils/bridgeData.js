import Store from 'electron-store';
import { makeRequest } from '../utils/httpsRequest.js';

const store = new Store();
let bridgeData = null;

const loadBridgeData = async () => {
    bridgeData = store.get('bridgeData') || null;

    return await verifyBridgeData();
};

const getBridgeData = () => {
    return bridgeData;
};

const verifyBridgeData = async () => {
    if (bridgeData === null) return false;

    const options = {
        hostname: bridgeData.ip,
        path: '/clip/v2/resource/device',
        method: 'GET',
        headers: {
            'hue-application-key': bridgeData.username,
        },
    };

    try {
        await makeRequest(options);
        return true;
    } catch (_error) {
        return false;
    }
};

const storeBridgeData = (data) => {
    bridgeData = data;
    store.set('bridgeData', data);
};

export { loadBridgeData, getBridgeData, storeBridgeData, store };
