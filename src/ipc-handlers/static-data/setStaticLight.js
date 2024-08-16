const { updateLight } = require('../../bridge-utils/lightResource');
const { convertHexToXy } = require('../../color-utils/colorConvert');

/**
 * Function required because color conversion is done in main process.
 * i.e. checks if color data, either hex or color temperatur, is present
 * and composes request.
 */
const composeColorUpdateData = (data) => {
    if (!data.hex && !data.mirek) {
        return data;
    }

    const updateData = {
        on: {
            on: true,
        },
        dynamics: {
            duration: 70,
        },
    };

    if (data.hex) {
        updateData.color = {
            xy: convertHexToXy(data.hex),
        };
    }

    if (data.mirek) {
        updateData.color_temperature = {
            mirek: parseInt(data.mirek),
        };
    }
    return updateData;
};

const setStaticLight = async (id, data) => {
    const updateData = composeColorUpdateData(data);
    const res = await updateLight(id, updateData);
    return res;
};

module.exports = { setStaticLight };
