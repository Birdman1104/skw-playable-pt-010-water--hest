import { Container } from 'pixi.js';

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
        //
    }
}
