import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

const algaePositions = [
    { x: 0, y: 30 },
    { x: -30, y: 30 },
    { x: 0, y: 30 },
    { x: 30, y: 30 },
];

export class Chest extends Container {
    private chestClosed: Sprite;
    private chestOpen: Sprite;
    private algae: Sprite[] = [];

    constructor() {
        super();
        this.build();
    }

    public float(): void {
        anime({
            targets: this,
            y: '+=10',
            duration: 1000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
        });
        anime({
            targets: this,
            angle: [-1, 1],
            duration: 800,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
        });
    }

    public open(): void {
        anime({
            targets: this.chestClosed,
            alpha: 0,
            duration: 300,
            easing: 'easeInOutSine',
        });
        anime({
            targets: this.chestOpen,
            alpha: 1,
            duration: 300,
            easing: 'easeInOutSine',
        });
    }

    public dropAlgae(): void {
        if (this.algae.length === 0) return;

        this.algae.forEach((algae, i) => {
            const da = 130;
            const angle = Math.random() * da - da / 2;
            anime({
                targets: algae,
                angle,
                y: 120,
                alpha: 0,
                duration: 1000,
                easing: 'easeOutQuad',
                complete: () => {
                    algae.destroy();
                    if (i === this.algae.length - 1) {
                        this.algae = [];
                    }
                },
            });
        });
    }

    private build(): void {
        this.buildOpenChest();
        this.buildClosedChest();
        this.buildAlgae();
    }

    private buildOpenChest(): void {
        this.chestOpen = makeSprite({
            texture: Images['chest/open'],
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 0.55, y: 0.55 },
            position: { x: 0, y: 10 },
        });
        this.chestOpen.alpha = 0;
        this.addChild(this.chestOpen);
    }

    private buildClosedChest(): void {
        this.chestClosed = makeSprite({
            texture: Images['chest/closed'],
            anchor: { x: 0.5, y: 0.5 },
            scale: { x: 0.6, y: 0.6 },
        });
        this.addChild(this.chestClosed);
    }

    private buildAlgae(): void {
        for (let i = 1; i <= 4; i++) {
            const algae = makeSprite({ texture: Images[`chest/algae_${i}`], anchor: { x: 0.5, y: 0.5 } });
            algae.position.set(algaePositions[i - 1].x, algaePositions[i - 1].y);
            this.algae.push(algae);
            this.addChild(algae);
        }
    }
}
