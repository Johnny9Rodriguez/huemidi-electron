const { printError } = require('../../debug-utils/printError');
const { updateResource } = require('../../bridge-utils/bridgeResource');
const { convertHexToXy } = require('../../color-utils/colorConvert');

/**
 * Function required because color conversion is done in main process.
 * i.e. checks if color data, either hex or color temperatur, is present
 * and composes request.
 */
const composeColorUpdateData = (data) => {
    const { color, ...other } = data;

    const updateData = {
        ...other,
    };

    if (color.mirek) {
        updateData.color_temperature = {
            mirek: parseInt(color.mirek),
        };
    } else if (color.hex) {
        updateData.color = {
            xy: convertHexToXy(color.hex),
        };
    } else if (color.xy) {
        updateData.color = { xy: color.xy };
    }

    return updateData;
};

const setResource = async (name, id, data) => {
    try {
        const updateData = data.color ? composeColorUpdateData(data) : data;
        await updateResource(name, id, updateData);
        return { error: null };
    } catch (error) {
        printError(error);
        return { error: error.message };
    }
};

module.exports = { setResource };
