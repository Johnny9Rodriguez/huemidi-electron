import https from 'https';
import path from 'path';
import fs from 'fs';
import { setAppData } from './bridgeSetup.js';

let bridgeIp;
let bridgeId;
let linking = false;
let linkingInterval = null;

const caCertPath = path.resolve(import.meta.dirname, '../../public/data/huebridge_cacert.pem'); // prettier-ignore
const caCert = fs.readFileSync(caCertPath, 'utf8');

function addCertificate(options) {
    const id = bridgeId.toLowerCase();

    const requestOptions = {
        ...options,
        ca: caCert,
        rejectUnauthorized: true,
        checkServerIdentity: (_hostname, cert) => {
            if (cert.subject.CN === id) {
                console.log('yo');
                return undefined;
            }
            return new Error('Certificate CN does not match device CN');
        },
    };

    return requestOptions;
}

const fetchAppKey = (bridgeIp) => {
    const options = {
        hostname: bridgeIp,
        path: '/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const requestOptions = addCertificate(options);

    return new Promise((resolve, reject) => {
        const req = https.request(requestOptions, (res) => {
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
            // console.error('Error:', error.message);
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
            const ip = bridgeIp;
            try {
                const appData = await fetchAppKey(ip); // username, clientkey
                setAppData(appData);
                stopLinking();
            } catch (_error) {
                // console.error('Failed to fetch app key:', error);
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

const setBridgeIp = (ip) => {
    bridgeIp = ip;
}

const setBridgeId = (id) => {
    bridgeId = id;
};

export { startLinking, stopLinking, setBridgeId, setBridgeIp };
