import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../../assets';
import { makeSprite } from '../../utils';

const config = [
    {
        name: 'leftHand',
        texture: Images['pirate/left_hand'],
        anchor: { x: 0.66, y: 0.5 },
        position: { x: 75, y: 0 },
    },
    {
        name: 'torso',
        texture: Images['pirate/body'],
    },
    {
        name: 'rightHand',
        texture: Images['pirate/right_hand'],
        anchor: { x: 0.325, y: 0.5 },
        position: { x: -95, y: 0 },
    },
];

export class PirateBody extends Container {
    private torso: Sprite;
    private leftHand: Sprite;
    private rightHand: Sprite;

    constructor() {
        super();

        this.build();
    }

    public panic(): void {
        this.reset();
        anime({
            targets: this.leftHand,
            rotation: [0, 0.3],
            duration: 300,
            direction: 'alternate',
            easing: 'linear',
            loop: true,
        });
        anime({
            targets: this.rightHand,
            rotation: [0, -0.3],
            duration: 300,
            direction: 'alternate',
            easing: 'linear',
            loop: true,
        });
    }

    public idle(): void {
        this.reset();
        anime({
            targets: this.leftHand,
            rotation: [0.7, 0.8],
            duration: 300,
            direction: 'alternate',
            easing: 'linear',
            loop: true,
        });
        anime({
            targets: this.rightHand,
            rotation: [-0.7, -0.8],
            duration: 300,
            direction: 'alternate',
            easing: 'linear',
            loop: true,
        });
    }

    private reset(): void {
        [this.leftHand, this.rightHand].forEach((hand) => {
            anime.remove(hand);
            hand.rotation = 0;
        });
    }

    private build(): void {
        config.forEach((c) => {
            this[c.name] = makeSprite(c);
            this.addChild(this[c.name]);
        });

        // this.torso = makeSprite({ texture: Images['pirate/body'] });
        // this.leftHand = makeSprite({
        //     texture: Images['pirate/left_hand'],
        //     anchor: { x: 0.66, y: 0.5 },
        //     position: { x: 75, y: 0 },
        // });
        // this.rightHand = makeSprite({
        //     texture: Images['pirate/right_hand'],
        //     anchor: { x: 0.325, y: 0.5 },
        //     position: { x: -95, y: 0 },
        // });

        // this.addChild(this.leftHand);
        // this.addChild(this.torso);
        // this.addChild(this.rightHand);
    }
}
