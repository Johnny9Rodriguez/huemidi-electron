const { createResource } = require('../../bridge-utils/bridgeResource');

const addResource = async (name, data) => {
    const res = await createResource(name, data);
    return res;
};

module.exports = { addResource };
