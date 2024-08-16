const fs = require('fs');
const path = require('path');

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

module.exports = {
    loadBridgeData,
    setBridgeData,
    getBridgeData,
};
