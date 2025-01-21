import { Container } from 'pixi.js';
import { PirateBody } from './PirateBody';
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
    private head: PirateHead;
    private body: PirateBody;

    constructor() {
        super();

        this.build();
    }

    private build(): void {
        this.head = new PirateHead();
        this.head.openMouth();

        this.body = new PirateBody();
        this.body.idle();
        this.addChild(this.body);
        this.addChild(this.head);
    }
}
