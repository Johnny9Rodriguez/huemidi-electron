import Store from 'electron-store';
import { makeRequest } from '../utils/httpsRequest.js';

const store = new Store();
let bridgeData = null;

const loadBridgeData = () => {
    bridgeData = store.get('bridgeData') || null;
};

const getBridgeData = () => {
    return bridgeData;
};

const deleteBridgeData = () => {
    store.set('bridgeData', null);
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

export {
    loadBridgeData,
    verifyBridgeData,
    getBridgeData,
    storeBridgeData,
    deleteBridgeData,
    store,
};
