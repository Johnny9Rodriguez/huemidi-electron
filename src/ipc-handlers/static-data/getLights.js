const { printError } = require('../../debug-utils/printError');
const {
    fetchResource,
    fetchResourceById,
} = require('../../bridge-utils/bridgeResource');
const { convertXyToHex } = require('../../color-utils/colorConvert');

const composeLightData = (light) => {
    const id = light.id;
    const name = light.metadata.name;
    const on = light.on.on;
    const bri = light.dimming.brightness;
    const xy = light.color.xy;
    const mirek = light.color_temperature.mirek;

    const mode = mirek ? 'white' : 'rgb';
    const hex = convertXyToHex(xy);

    return {
        id,
        name,
        state: {
            on,
            bri,
            color: {
                mode,
                xy,
                hex,
                mirek,
            },
        },
    };
};

const getAllLights = async (rids = []) => {
    const allLights = [];
    const lights = await fetchResource('light');

    if (!lights) {
        throw new Error('Error: Unable to fetch lights.');
    }

    for (const light of lights) {
        if (rids.length > 0 && !rids.includes(light.owner.rid)) {
            continue;
        }

        const lightData = composeLightData(light);
        allLights.push(lightData);
    }

    return allLights;
};

const getRoomLights = async (roomID) => {
    const { error, data: room } = await fetchResourceById('room', roomID);

    if (error) {
        throw new Error(error);
    }

    if (!room || !room[0]) {
        throw new Error('Error: Unable to fetch room.');
    }

    const rids = [];

    for (const child of room[0].children) {
        rids.push(child.rid);
    }

    return await getAllLights(rids);
};

const getZoneLights = async (zoneID) => {
    const { error, data: zone } = await fetchResourceById('zone', zoneID);

    if (error) {
        throw new Error(error);
    }

    if (!zone || !zone[0]) {
        throw new Error('Error: Unable to fetch room.');
    }

    const rids = [];

    for (const child of zone[0].children) {
        rids.push(child.rid);
    }

    const zoneLights = [];
    const allLights = await getAllLights();

    for (const light of allLights) {
        if (rids.length > 0 && !rids.includes(light.id)) {
            continue;
        }

        zoneLights.push(light);
    }

    return zoneLights;
};

const getLightsByType = async (groupID, type) => {
    let lights;
    switch (type) {
        case 'bridge_home':
            lights = await getAllLights();
            break;
        case 'room':
            lights = await getRoomLights(groupID);
            break;
        case 'zone':
            lights = await getZoneLights(groupID);
            break;
    }
    // Sort lights by name.
    lights.sort((a, b) => a.name.localeCompare(b.name));
    return lights;
};

const getLights = async (groupID, type) => {
    try {
        const data = await getLightsByType(groupID, type);
        return { error: null, data };
    } catch (error) {
        return { error: error.message, data: null };
    }
};

module.exports = { getLights };
