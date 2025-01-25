import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

const algaeConfig = [
    { x: 0, y: 30, texture: 'chest/algae_1' },
    { x: -30, y: 30, texture: 'chest/algae_2' },
    { x: 0, y: 30, texture: 'chest/algae_1', scale: { x: -1, y: 1 } },
    { x: 30, y: 30, texture: 'chest/algae_2', scale: { x: -1, y: 1 } },
];

export class Chest extends Container {
    private chestClosed: Sprite;
    private chestOpen: Sprite;
    private algae: Sprite[] = [];
    private sparks: Sprite[] = [];

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
        this.animateSparks();
    }

    public dropAlgae(): void {
        if (this.algae.length === 0) return;

        this.algae.forEach((algae, i) => {
            const da = 180;
            const angle = Math.random() * da - da / 2;
            anime({
                targets: algae,
                angle,
                y: 120,
                alpha: 0,
                duration: 1000,
                easing: 'easeInOutSine',
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
        this.buildSparks();
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
            const { texture, x, y, scale = { x: 1, y: 1 } } = algaeConfig[i - 1];
            const algae = makeSprite({
                texture: Images[`${texture}`],
                anchor: { x: 0.5, y: 0.5 },
                scale: { x: scale.x, y: scale.y },
            });
            algae.position.set(x, y);
            this.algae.push(algae);
            this.addChild(algae);
        }
    }

    private buildSparks(): void {
        for (let i = 0; i < 5; i++) {
            const spark = makeSprite({ texture: Images['game/white_spark'], anchor: { x: 0.5, y: 0.5 } });
            spark.alpha = 0;
            this.sparks.push(spark);
            this.addChild(spark);
        }
    }

    private animateSparks(): void {
        this.sparks.forEach((spark, i) => {
            let x = -90 + Math.random() * 80;
            let y = 30 + Math.random() * 20 - 10;
            const duration = Math.random() * 1000 + 500;
            const angle = 360;

            spark.position.set(x, y);
            spark.scale.set(0);
            spark.alpha = 0;
            let loop = 0;
            anime({
                targets: spark,
                alpha: 0.8,
                duration,
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine',
                loopComplete: () => {
                    loop++;
                    if (loop % 2 === 0) {
                        x = -90 + Math.random() * 80;
                        y = 30 + Math.random() * 20 - 10;
                        spark.position.set(x, y);
                    }

                    if (loop === 1000) {
                        loop = 0;
                    }
                },
                delay: i * 100,
            });
            anime({
                targets: spark,
                angle,
                duration: duration * 2,
                loop: true,
                direction: 'alternate',
                easing: 'linear',
                delay: i * 100,
            });
            anime({
                targets: spark.scale,
                x: 0.4,
                y: 0.4,
                direction: 'alternate',
                duration,
                loop: true,
                easing: 'easeInOutSine',
                delay: i * 100,
            });
        });
    }
}
