import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../../assets';
import { makeSprite } from '../../utils';
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
    private water: Sprite;
    private wave: Sprite;

    constructor() {
        super();

        this.build();
    }

    public fall(): void {
        this.head.scared();
        this.head.openEyes();
        this.body.fall();
    }

    public idle(): void {
        this.body.idle();
    }

    public float(): void {
        anime({
            targets: this.wave,
            alpha: 1,
            duration: 300,
            easing: 'easeInOutSine',
        });
        anime({
            targets: this.wave.scale,
            x: 1,
            y: 1,
            duration: 100,
            easing: 'easeInOutSine',
        });
        anime({
            targets: this.water,
            alpha: 0.5,
            duration: 100,
            easing: 'easeInOutSine',
        });
        anime({
            targets: this,
            y: '+=20',
            duration: 1000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
        });
    }

    private build(): void {
        this.head = new PirateHead();
        this.head.openMouth();

        this.body = new PirateBody();
        this.body.idle();

        this.water = makeSprite({
            texture: Images['pirate/water_layer'],
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 0.8, y: 0.8 },
            position: { x: -27, y: 268 },
        });

        this.wave = makeSprite({
            texture: Images['game/wave'],
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 0.1, y: 0.1 },
            position: { x: 0, y: 130 },
        });

        this.water.alpha = 0;
        this.wave.alpha = 0;

        this.addChild(this.body);
        this.addChild(this.head);
        this.addChild(this.water);
        this.addChild(this.wave);
    }
}
