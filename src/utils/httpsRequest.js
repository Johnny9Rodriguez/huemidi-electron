const https = require('https');

// Makes an HTTPS request and returns a promise that resolves with the JSON parsed response data.
function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
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
                                `${options.method} https://${options.hostname}${options.path}\n` +
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

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

module.exports = { makeRequest };
