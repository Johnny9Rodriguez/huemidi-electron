import fs from 'fs';
import path from 'path';

let bridgeData = null;

const loadBridgeData = (rootDir) => {
    // TODO: error handling (check for file, loaded correctly, ...)
    const jsonData = fs.readFileSync(
        path.join(rootDir, 'testData/bridgeData.json')
    );
    bridgeData = JSON.parse(jsonData);
};

const setBridgeData = (data) => {
    bridgeData = data;
};

const getBridgeData = () => {
    return bridgeData;
};

export {
    loadBridgeData,
    setBridgeData,
    getBridgeData,
};
