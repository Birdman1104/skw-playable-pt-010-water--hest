import { CellAlign } from '@armathai/pixi-grid';
import { lp } from '../../utils';

export const getForegroundGridConfig = () => {
    return lp(getForegroundGridLandscapeConfig, getForegroundGridPortraitConfig).call(null);
};

const getForegroundGridLandscapeConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'foreground',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'sound',
                align: CellAlign.leftBottom,
                bounds: { x: 0, y: 0.9, width: 0.1, height: 0.1 },
                offset: { x: 10, y: -10 },
            },
        ],
    };
};

const getForegroundGridPortraitConfig = () => {
    const bounds = { x: 0, y: 0, width: document.body.clientWidth, height: document.body.clientHeight };
    return {
        name: 'foreground',
        // debug: { color: 0xff5027 },
        bounds,
        cells: [
            {
                name: 'sound',
                align: CellAlign.leftBottom,
                bounds: { x: 0, y: 0.925, width: 0.075, height: 0.075 },
                offset: { x: 10, y: -10 },
            },
        ],
    };
};
