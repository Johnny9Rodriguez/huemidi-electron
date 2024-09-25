import https from 'https';
import path from 'path';
import fs from 'fs';
import { getBridgeData } from '../bridge-utils/bridgeData.js';

const caCertPath = path.resolve(import.meta.dirname, '../../public/data/huebridge_cacert.pem'); // prettier-ignore
const caCert = fs.readFileSync(caCertPath, 'utf8');

function addCertificate(options) {
    const bridgeData = getBridgeData();

    const requestOptions = {
        ...options,
        ca: caCert,
        rejectUnauthorized: true,
        checkServerIdentity: (_hostname, cert) => {
            if (cert.subject.CN === bridgeData.id) {
                return undefined;
            }
            return new Error('Certificate CN does not match device CN');
        },
    };

    return requestOptions;
}

// Makes an HTTPS request and returns a promise that resolves with the JSON parsed response data.
function makeRequest(options) {
    const requestOptions = addCertificate(options);

    return new Promise((resolve, reject) => {
        const req = https.request(requestOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const parsedData = JSON.parse(data);

                // On error return error messages from Hue response.
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    let errorMessages = 'Unknown error';
                    if (parsedData.errors && parsedData.errors.length > 0) {
                        errorMessages = parsedData.errors
                            .map((err) => err.description)
                            .join(', ');
                    }
                    return reject(
                        new Error(
                            `Request failed with status code ${res.statusCode}\n` +
                                `${requestOptions.method} https://${requestOptions.hostname}${requestOptions.path}\n` +
                                errorMessages
                        )
                    );
                }

                resolve(parsedData.data);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (requestOptions.body) {
            req.write(requestOptions.body);
        }

        req.end();
    });
}

export { makeRequest };
