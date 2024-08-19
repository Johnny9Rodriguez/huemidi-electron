const { deleteResource } = require('../../bridge-utils/bridgeResource');

const removeResource = async (name, id) => {
    return await deleteResource(name, id);
};

module.exports = { removeResource };
