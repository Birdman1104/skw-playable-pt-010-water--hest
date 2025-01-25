import anime from 'animejs';
import { Container } from 'pixi.js';
import { PirateBody } from './PirateBody';
import { PirateHead } from './PirateHead';

export class Pirate extends Container {
    private head: PirateHead;
    private body: PirateBody;

    constructor() {
        super();

        this.build();
    }

    public surprised(): void {
        this.head.scared();
    }

    public happy(): void {
        this.head.pleased();
    }

    public fall(): void {
        this.head.scared();
        this.head.openEyes();
        this.body.fall();
    }

    public idle(): void {
        this.body.idle();
        this.head.idle();
        this.head.sad();
    }

    public float(): void {
        anime({
            targets: [this.head, this.body],
            y: '+=20',
            duration: 1000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
        });
        anime({
            targets: [this.head, this.body],
            angle: [-1, 1],
            duration: 1300,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
        });
    }

    private build(): void {
        this.head = new PirateHead();
        this.head.openMouth();

        this.body = new PirateBody();

        this.addChild(this.body);
        this.addChild(this.head);
    }
}
