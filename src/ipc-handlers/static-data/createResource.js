const { createResource } = require('../../bridge-utils/bridgeResource');

const addResource = async (name, data) => {
    return await createResource(name, data);
};

module.exports = { addResource };
