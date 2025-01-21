import { Container } from 'pixi.js';
import { delayRunnable } from '../../utils';
import { PirateHead } from './PirateHead';

const LAYERS = [
    {
        name: 'body',
        anchor: { x: 0.5, y: 0.5 },
    },
    {
        name: 'head',
    },
];

export class Pirate extends Container {
    constructor() {
        super();

        this.build();
    }

    private build(): void {
        const head = new PirateHead();
        head.idle();

        delayRunnable(1, () => head.sad());
        this.addChild(head);
    }
}
