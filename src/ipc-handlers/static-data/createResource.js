const { printError } = require('../../debug-utils/printError');
const { createResource } = require('../../bridge-utils/bridgeResource');

const addResource = async (name, data) => {
    try {
        const res = await createResource(name, data);
        return { error: null, data: res };
    } catch (error) {
        printError(error);
        return { error: error.message };
    }
};

module.exports = { addResource };
