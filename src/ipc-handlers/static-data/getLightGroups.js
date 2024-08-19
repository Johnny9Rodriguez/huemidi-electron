const { printError } = require('../../debug-utils/printError');
const {
    fetchResource,
    fetchResourceById,
} = require('../../bridge-utils/bridgeResource');

const getGroupedLights = async () => {
    const groupedLights = await fetchResource('grouped_light');

    if (!groupedLights) {
        throw new Error('Error: Unable to fetch grouped lights.');
    }

    return groupedLights;
};

const getResource = async ({ rid, rtype }) => {
    const { error, data: resource } = await fetchResourceById(rtype, rid);

    if (error) {
        throw new Error(error);
    }

    if (!resource || !resource[0]) {
        throw new Error(`Error: Unable to fetch ${rtype}.`);
    }

    return {
        id: resource[0].id,
        name:
            rtype === 'bridge_home' ? 'All Lights' : resource[0].metadata.name,
        type: resource[0].type,
    };
};

const getLightGroups = async () => {
    try {
        const lightGroups = [];
        const groupedLights = await getGroupedLights();

        for (const group of groupedLights) {
            const resource = await getResource(group.owner);
            lightGroups.push({ ...resource, group_id: group.id });
        }

        // Sort lightGroups first by rtype, then by name
        lightGroups.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            return a.type.localeCompare(b.type);
        });

        return { error: null, data: lightGroups };
    } catch (error) {
        return { error, data: null };
    }
};

module.exports = { getLightGroups };
