import { CellAlign, CellScale } from '@armathai/pixi-grid';
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
                name: 'match3',
                bounds: { x: 0.2, y: 0.2, width: 0.6, height: 0.6 },
            },
            {
                name: 'pcta',
                bounds: { x: 0.775, y: 0.8, width: 0.2, height: 0.175 },
            },
            {
                name: 'logo',
                bounds: { x: 0.015, y: 0.05, width: 0.175, height: 0.25 },
            },
            {
                name: 'sound',
                align: CellAlign.leftBottom,
                bounds: { x: 0, y: 0.9, width: 0.1, height: 0.1 },
                offset: { x: 10, y: -10 },
            },
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
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
                name: 'match3',
                bounds: { x: 0.2, y: 0.2, width: 0.6, height: 0.6 },
            },
            {
                name: 'logo',
                bounds: { x: 0.25, y: 0.025, width: 0.5, height: 0.15 },
            },
            {
                name: 'pcta',
                bounds: { x: 0.5, y: 0.9, width: 0.4, height: 0.075 },
            },
            {
                name: 'sound',
                align: CellAlign.leftBottom,
                bounds: { x: 0, y: 0.925, width: 0.075, height: 0.075 },
                offset: { x: 10, y: -10 },
            },
            {
                name: 'blocker',
                scale: CellScale.fill,
                bounds: { x: 0, y: 0, width: 1, height: 1 },
            },
        ],
    };
};
