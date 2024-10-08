import { getBridgeData } from './bridgeData.js';
import { makeRequest } from '../utils/httpsRequest.js';
import { printError } from '../debug-utils/printError.js';

const fetchResource = async (name) => {
    const bridgeData = getBridgeData();

    const options = {
        hostname: bridgeData.ip,
        path: `/clip/v2/resource/${name}`,
        method: 'GET',
        headers: {
            'hue-application-key': bridgeData.username,
        },
    };

    try {
        const data = await makeRequest(options);
        return { error: null, data };
    } catch (error) {
        printError(error);
        return { error, data: null };
    }
};

const fetchResourceById = async (name, id) => {
    const bridgeData = getBridgeData();

    const options = {
        hostname: bridgeData.ip,
        path: `/clip/v2/resource/${name}/${id}`,
        method: 'GET',
        headers: {
            'hue-application-key': bridgeData.username,
        },
    };

    try {
        const data = await makeRequest(options);
        return { error: null, data };
    } catch (error) {
        printError(error);
        return { error, data: null };
    }
};

const updateResource = async (name, id, data) => {
    const bridgeData = getBridgeData();

    const options = {
        hostname: bridgeData.ip,
        path: `/clip/v2/resource/${name}/${id}`,
        method: 'PUT',
        headers: {
            'hue-application-key': bridgeData.username,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const data = await makeRequest(options);
        return { error: null, data };
    } catch (error) {
        printError(error);
        return { error, data: null };
    }
};

const createResource = async (name, data) => {
    const bridgeData = getBridgeData();

    const options = {
        hostname: bridgeData.ip,
        path: `/clip/v2/resource/${name}`,
        method: 'POST',
        headers: {
            'hue-application-key': bridgeData.username,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const data = await makeRequest(options);
        return { error: null, data };
    } catch (error) {
        printError(error);
        return { error, data: null };
    }
};

const deleteResource = async (name, id) => {
    const bridgeData = getBridgeData();

    const options = {
        hostname: bridgeData.ip,
        path: `/clip/v2/resource/${name}/${id}`,
        method: 'DELETE',
        headers: {
            'hue-application-key': bridgeData.username,
        },
    };

    try {
        const data = await makeRequest(options);
        return { error: null, data };
    } catch (error) {
        printError(error);
        return { error, data: null };
    }
};

export {
    fetchResource,
    fetchResourceById,
    updateResource,
    createResource,
    deleteResource,
};
