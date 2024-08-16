const { fetchResource } = require('../../bridge-utils/bridgeResource');
const { convertXyToHex, getWhiteColor } = require('../../color-utils/colorConvert'); // prettier-ignore
const { printError } = require('../../debug-utils/printError');

const getColorPalette = (actions) => {
    const palette = [];

    for (const item of actions) {
        const { action } = item;

        let hex;
        if (action.color) {
            hex = convertXyToHex(action.color.xy);
        } else if (action.color_temperature) {
            hex = getWhiteColor(action.color_temperature.mirek);
        } else {
            continue;
        }

        if (!palette.includes(hex)) palette.push(hex);
    }

    return palette;
};

const getScenesByGroup = async (groupID) => {
    try {
        const scenes = await fetchResource('scene');

        const data = [];

        for (const scene of scenes) {
            if (scene.group.rid === groupID) {
                const sceneID = scene.id;
                const name = scene.metadata.name;
                const actions = scene.actions.filter(
                    (action) => action.target.rtype === 'light'
                );
                const palette = getColorPalette(actions);
                const group = scene.group;
                data.push({ id: sceneID, name, actions, palette, group });
            }
        }

        data.sort((a, b) => a.name.localeCompare(b.name));
        return { error: null, data };
    } catch (error) {
        printError(error);
        return { error: error.message, data: null };
    }
};

module.exports = { getScenesByGroup };
