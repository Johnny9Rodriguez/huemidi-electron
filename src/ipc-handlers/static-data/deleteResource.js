const { printError } = require('../../debug-utils/printError');
const { deleteResource } = require('../../bridge-utils/bridgeResource');

const removeResource = async (name, id) => {
    try {
        await deleteResource(name, id);
        return { error: null };
    } catch (error) {
        printError(error);
        return { error: error.message };
    }
};

module.exports = { removeResource };
