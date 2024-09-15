import { fetchResource } from '../../bridge-utils/bridgeResource.js';
import { convertXyToHex, getWhiteColor } from '../../color-utils/colorConvert.js';
import { printError } from '../../debug-utils/printError.js';

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
        const { error, data: scenes } = await fetchResource('scene');

        if (error) {
            throw new Error(error);
        }

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

export { getScenesByGroup };
