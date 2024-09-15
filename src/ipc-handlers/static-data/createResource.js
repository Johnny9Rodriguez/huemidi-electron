import { createResource } from '../../bridge-utils/bridgeResource.js';

const addResource = async (name, data) => {
    return await createResource(name, data);
};

export { addResource };
