import https from 'https';
import { setAppData } from './bridgeSetup.js';

let linking = false;
let linkingInterval = null;

const fetchAppKey = (bridgeIp) => {
    const options = {
        hostname: bridgeIp,
        path: '/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const parsedData = JSON.parse(data);
                if (parsedData[0].error) {
                    reject(parsedData[0].error);
                } else if (parsedData[0].success) {
                    resolve(parsedData[0].success);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error:', error.message);
            reject(error);
        });

        req.write(
            JSON.stringify({
                devicetype: 'huemidi',
                generateclientkey: true,
            })
        );

        req.end();
    });
};

const startLinking = async () => {
    linking = true;
    linkingInterval = setInterval(async () => {
        if (linking) {
            const ip = '192.168.0.181';
            try {
                const appData = await fetchAppKey(ip); // username, clientkey
                setAppData(appData);
                stopLinking();
            } catch (error) {
                console.error('Failed to fetch app key:', error);
            }
        } else {
            clearInterval(linkingInterval);
            linkingInterval = null;
        }
    }, 1000);
};

const stopLinking = () => {
    linking = false;
    if (linkingInterval) {
        clearInterval(linkingInterval);
        linkingInterval = null;
    }
};

export { startLinking, stopLinking };
