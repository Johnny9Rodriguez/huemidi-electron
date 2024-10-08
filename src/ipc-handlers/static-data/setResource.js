import { updateResource } from '../../bridge-utils/bridgeResource.js';
import { convertHexToXy } from '../../color-utils/colorConvert.js';

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
    } else if (color.xy) {
        updateData.color = { xy: color.xy };
    } else if (color.hex) {
        updateData.color = {
            xy: convertHexToXy(color.hex),
        };
    }

    return updateData;
};

const setResource = async (name, id, data) => {
    const updateData = data.color ? composeColorUpdateData(data) : data;
    return updateResource(name, id, updateData);
};

export { setResource };
