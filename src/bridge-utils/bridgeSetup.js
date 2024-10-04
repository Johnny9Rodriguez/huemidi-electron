import dnsSd from 'node-dns-sd';
import { storeBridgeData } from './bridgeData.js';
import { setBridgeId, setBridgeIp } from './bridgeLink.js';
import { setupWindow } from '../app-utils/boot.js';
import http from 'http';

let discoveredBridge;

const discoverBridge = async () => {
    try {
        const deviceList = await dnsSd.discover({
            name: '_hue._tcp.local',
            // name: '_services._dns-sd._udp.local', // List all devices
            // name: '_nothing_found_test',
        });

        if (deviceList.length > 0) {
            const bridge = deviceList[0];
            discoveredBridge = await getBridgeInfo(bridge);
            setBridgeIp(discoveredBridge.ip);
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

async function fetchBridgeConfig(bridgeIp) {
    const options = {
        hostname: bridgeIp,
        path: '/api/config',
        method: 'GET',
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const config = JSON.parse(data);
                    resolve(config);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

const getBridgeInfo = async (bridge) => {
    // const answer = bridge.packet.answers.find(
    //     (answer) => answer.type === 'TXT'
    // );

    // const bridgeName = answer.name.replace('._hue._tcp.local', '');
    // const bridgeId = answer.rdata.bridgeid;
    // const bridgeIp = bridge.address;

    const bridgeIp = bridge.address;
    const bridgeConfig = await fetchBridgeConfig(bridgeIp);
    const bridgeId = bridgeConfig.bridgeid;
    const bridgeName = bridgeConfig.name;

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

export { discoverBridge, setAppData, discoveredBridge };
