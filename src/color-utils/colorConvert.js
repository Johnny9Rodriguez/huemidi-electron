// Represents a CIE 1931 XY coordinate pair.
class XYPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorHelper {
    constructor(gamut) {
        this.Red = gamut[0];
        this.Lime = gamut[1];
        this.Blue = gamut[2];
    }

    hexToRed(hex) {
        return parseInt(hex.substring(0, 2), 16);
    }

    hexToGreen(hex) {
        return parseInt(hex.substring(2, 4), 16);
    }

    hexToBlue(hex) {
        return parseInt(hex.substring(4, 6), 16);
    }

    hexToRgb(h) {
        return [this.hexToRed(h), this.hexToGreen(h), this.hexToBlue(h)];
    }

    rgbToHex(r, g, b) {
        return `${r.toString(16).padStart(2, '0')}${g
            .toString(16)
            .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    getXyPointFromRgb(red_i, green_i, blue_i) {
        const red = red_i / 255.0;
        const green = green_i / 255.0;
        const blue = blue_i / 255.0;

        const r =
            red > 0.04045
                ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4)
                : red / 12.92;
        const g =
            green > 0.04045
                ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4)
                : green / 12.92;
        const b =
            blue > 0.04045
                ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4)
                : blue / 12.92;

        const X = r * 0.664511 + g * 0.154324 + b * 0.162028;
        const Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
        const Z = r * 0.000088 + g * 0.07231 + b * 0.986039;

        const cx = X / (X + Y + Z);
        const cy = Y / (X + Y + Z);

        return new XYPoint(cx, cy);
    }

    crossProduct(p1, p2) {
        return p1.x * p2.y - p1.y * p2.x;
    }

    checkPointInLampsReach(p) {
        const v1 = new XYPoint(
            this.Lime.x - this.Red.x,
            this.Lime.y - this.Red.y
        );
        const v2 = new XYPoint(
            this.Blue.x - this.Red.x,
            this.Blue.y - this.Red.y
        );

        const q = new XYPoint(p.x - this.Red.x, p.y - this.Red.y);
        const s = this.crossProduct(q, v2) / this.crossProduct(v1, v2);
        const t = this.crossProduct(v1, q) / this.crossProduct(v1, v2);

        return s >= 0.0 && t >= 0.0 && s + t <= 1.0;
    }

    getClosestPointToLine(A, B, P) {
        const AP = new XYPoint(P.x - A.x, P.y - A.y);
        const AB = new XYPoint(B.x - A.x, B.y - A.y);
        const ab2 = AB.x * AB.x + AB.y * AB.y;
        const ap_ab = AP.x * AB.x + AP.y * AB.y;
        let t = ap_ab / ab2;

        if (t < 0.0) {
            t = 0.0;
        } else if (t > 1.0) {
            t = 1.0;
        }

        return new XYPoint(A.x + AB.x * t, A.y + AB.y * t);
    }

    getClosestPointToPoint(xy_point) {
        const pAB = this.getClosestPointToLine(this.Red, this.Lime, xy_point);
        const pAC = this.getClosestPointToLine(this.Blue, this.Red, xy_point);
        const pBC = this.getClosestPointToLine(this.Lime, this.Blue, xy_point);

        const dAB = this.getDistanceBetweenTwoPoints(xy_point, pAB);
        const dAC = this.getDistanceBetweenTwoPoints(xy_point, pAC);
        const dBC = this.getDistanceBetweenTwoPoints(xy_point, pBC);

        let lowest = dAB;
        let closest_point = pAB;

        if (dAC < lowest) {
            lowest = dAC;
            closest_point = pAC;
        }

        if (dBC < lowest) {
            lowest = dBC;
            closest_point = pBC;
        }

        return new XYPoint(closest_point.x, closest_point.y);
    }

    getDistanceBetweenTwoPoints(one, two) {
        const dx = one.x - two.x;
        const dy = one.y - two.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getXyPointFromRgb(red_i, green_i, blue_i) {
        const red = red_i / 255.0;
        const green = green_i / 255.0;
        const blue = blue_i / 255.0;

        const r =
            red > 0.04045
                ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4)
                : red / 12.92;
        const g =
            green > 0.04045
                ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4)
                : green / 12.92;
        const b =
            blue > 0.04045
                ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4)
                : blue / 12.92;

        const X = r * 0.664511 + g * 0.154324 + b * 0.162028;
        const Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
        const Z = r * 0.000088 + g * 0.07231 + b * 0.986039;

        const cx = X / (X + Y + Z);
        const cy = Y / (X + Y + Z);

        let xy_point = new XYPoint(cx, cy);
        const in_reach = this.checkPointInLampsReach(xy_point);

        if (!in_reach) {
            xy_point = this.getClosestPointToPoint(xy_point);
        }

        return xy_point;
    }

    getRgbFromXyAndBrightness(x, y, bri = 1) {
        let xy_point = new XYPoint(x, y);

        if (!this.checkPointInLampsReach(xy_point)) {
            xy_point = this.getClosestPointToPoint(xy_point);
        }

        const Y = bri;
        const X = (Y / xy_point.y) * xy_point.x;
        const Z = (Y / xy_point.y) * (1 - xy_point.x - xy_point.y);

        let r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
        let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
        let b = X * 0.051713 - Y * 0.121364 + Z * 1.01153;

        [r, g, b] = [r, g, b].map((x) =>
            x <= 0.0031308
                ? 12.92 * x
                : (1.0 + 0.055) * Math.pow(x, 1.0 / 2.4) - 0.055
        );

        [r, g, b] = [r, g, b].map((x) => Math.max(0, x));

        const max_component = Math.max(r, g, b);
        if (max_component > 1) {
            [r, g, b] = [r, g, b].map((x) => x / max_component);
        }

        [r, g, b] = [r, g, b].map((x) => Math.round(x * 255));

        return [r, g, b];
    }

    mixColors(hexA, hexB, p) {
        let rgbA = this.hexToRgb(hexA);
        let rgbB = this.hexToRgb(hexB);

        rgbA = rgbA.map((value) => value * (1 - p));
        rgbB = rgbB.map((value) => value * p);

        const rgb = rgbA.map((value, index) => Math.round(value + rgbB[index]));
        const hex = this.rgbToHex(...rgb);

        return '#' + hex;
    }
}

// Hue BR30, A19 (Gen 3), Hue Go, LightStrips plus
const gamutC = [
    new XYPoint(0.692, 0.308),
    new XYPoint(0.17, 0.7),
    new XYPoint(0.153, 0.048),
];

const color = new ColorHelper(gamutC);

const convertHexToXy = (h) => {
    const hex = h.startsWith('#') ? h.slice(1) : h;
    const rgb = color.hexToRgb(hex);
    const point = color.getXyPointFromRgb(rgb[0], rgb[1], rgb[2]);
    return { x: point.x, y: point.y };
};

const convertXyToHex = ({ x, y }, bri = 1) => {
    const [r, g, b] = color.getRgbFromXyAndBrightness(x, y, bri);
    return '#' + color.rgbToHex(r, g, b);
};

function getWhiteColor(mirek) {
    const whiteGradient = ['f4fdff', 'ffd98d', 'ffb243'];

    switch (mirek) {
        case 153:
            return '#' + whiteGradient[0];
        case 326:
            return '#' + whiteGradient[1];
        case 500:
            return '#' + whiteGradient[2];
        default:
            if (mirek < 326) {
                const p = (mirek - 153) / 173;
                return color.mixColors(whiteGradient[0], whiteGradient[1], p);
            } else {
                const p = (mirek - 326) / 174;
                return color.mixColors(whiteGradient[1], whiteGradient[2], p);
            }
    }
}

export { convertHexToXy, convertXyToHex, getWhiteColor };
