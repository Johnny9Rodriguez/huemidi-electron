import dnsSd from 'node-dns-sd';
import { store, storeBridgeData } from './bridgeData.js';

let setupWindow;
let bridge;

const discoverBridge = async (window) => {
    setupWindow = window;

    try {
        const deviceList = await dnsSd.discover({
            name: '_hue._tcp.local',
            // name: '_nothing_found_test',
        });

        if (deviceList.length > 0) {
            bridge = deviceList[0];
            setupWindow.webContents.send('bridge-found', {
                bridge,
            });
        } else {
            // Bridge not found.
            setupWindow.webContents.send('bridge-not-found');
        }
    } catch (error) {
        console.error('Error discovering Hue Bridge:', error);
    }
};

const name = () => {
    const bName = bridge.packet.answers[0].name;
    const bType = '.' + bridge.fqdn;
    return bName.replace(bType, '');
};

const setAppData = (data) => {
    const bridgeData = {
        name: name(),
        ip: bridge.address,
        username: data.username,
        clientkey: data.clientkey,
    };
    storeBridgeData(bridgeData);
    setupWindow.webContents.send('bridge-linked');
};

export { discoverBridge, setAppData };
