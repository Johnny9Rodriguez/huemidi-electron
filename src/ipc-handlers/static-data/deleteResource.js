import { deleteResource } from '../../bridge-utils/bridgeResource.js';

const removeResource = async (name, id) => {
    return await deleteResource(name, id);
};

export { removeResource };
