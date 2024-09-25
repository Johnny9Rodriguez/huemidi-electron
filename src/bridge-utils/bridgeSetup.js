import dnsSd from 'node-dns-sd';
import { storeBridgeData } from './bridgeData.js';
import { setBridgeId } from './bridgeLink.js';

let setupWindow;
let discoveredBridge;

const discoverBridge = async (window) => {
    setupWindow = window;

    try {
        const deviceList = await dnsSd.discover({
            name: '_hue._tcp.local',
            // name: '_nothing_found_test',
        });

        if (deviceList.length > 0) {
            const bridge = deviceList[0];
            discoveredBridge = getBridgeInfo(bridge);
            setBridgeId(discoveredBridge.id);
            setupWindow.webContents.send('bridge-found', {
                bridge: discoveredBridge,
            });
        } else {
            // Bridge not found.
            setupWindow.webContents.send('bridge-not-found');
        }
    } catch (error) {
        console.error('Error discovering Hue Bridge:', error);
    }
};

const getBridgeInfo = (bridge) => {
    const answer = bridge.packet.answers.find(
        (answer) => answer.type === 'TXT'
    );

    const bridgeName = answer.name.replace('._hue._tcp.local', '');
    const bridgeId = answer.rdata.bridgeid;
    const bridgeIp = bridge.address;

    return { name: bridgeName, id: bridgeId, ip: bridgeIp };
};

const setAppData = (data) => {
    const bridgeData = {
        ...discoveredBridge,
        username: data.username,
        clientkey: data.clientkey,
    };
    storeBridgeData(bridgeData);
    setupWindow.webContents.send('bridge-linked');
};

export { discoverBridge, setAppData };