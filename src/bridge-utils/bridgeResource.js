const { getBridgeData } = require('./bridgeData');
const { makeRequest } = require('../utils/httpsRequest');
const { printError } = require('../debug-utils/printError');

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
        return await makeRequest(options);
    } catch (error) {
        printError(error);
        return null;
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
        return await makeRequest(options);
    } catch (error) {
        printError(error);
        return null;
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
        return await makeRequest(options);
    } catch (error) {
        printError(error);
        return null;
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
        return await makeRequest(options);
    } catch (error) {
        printError(error);
        return null;
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
        return await makeRequest(options);
    } catch (error) {
        printError(error);
        return null;
    }
};

module.exports = {
    fetchResource,
    fetchResourceById,
    updateResource,
    createResource,
    deleteResource,
};
