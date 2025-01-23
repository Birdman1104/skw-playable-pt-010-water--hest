import anime from 'animejs';
import { AnimatedSprite, Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

export class Chest extends Container {
    private staticChest: Sprite;
    private lock: Sprite;
    private coins: Sprite;
    private animatedChest: AnimatedSprite;
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
            targets: this.lock.scale,
            x: 0,
            y: 0,
            duration: 300,
            easing: 'easeInOutSine',
            complete: () => {
                this.staticChest.visible = false;
                this.animatedChest.visible = true;
                this.animatedChest.play();
            },
        });
    }

    public dropAlgae(): void {
        if (this.algae.length === 0) return;

        this.algae.forEach((algae, i) => {
            const angle = Math.random() * 50 - 25;
            console.warn(angle);

            anime({
                targets: algae,
                angle,
                y: 170,
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
        this.buildStaticSprite();
        this.buildLock();
        this.buildAnimatedChest();
        this.buildCoins();
        this.buildAlgae();
    }

    private buildStaticSprite(): void {
        this.staticChest = makeSprite({ texture: Images['chest/0'], anchor: { x: 0.5, y: 0.5 } });
        this.addChild(this.staticChest);
    }

    private buildLock(): void {
        this.lock = makeSprite({ texture: Images['chest/lock'], anchor: { x: 0.5, y: 0.7 }, scale: { x: 0.9, y: 1 } });
        this.lock.y = 46;
        this.addChild(this.lock);
    }

    private buildCoins(): void {
        this.coins = makeSprite({
            texture: Images['chest/coins'],
            anchor: { x: 0.5, y: 0.5 },
        });
        this.coins.scale.set(0);
        this.coins.alpha = 0;
        this.coins.visible = false;
        this.addChild(this.coins);
    }

    private buildAlgae(): void {
        for (let i = 1; i <= 4; i++) {
            const algae = makeSprite({ texture: Images[`chest/algae_${i}`], anchor: { x: 0.5, y: 0.5 } });
            algae.position.set(0, 57);
            this.algae.push(algae);
            this.addChild(algae);
        }
    }

    private buildAnimatedChest(): void {
        const frames: any[] = [];
        for (let i = 0; i <= 4; i++) {
            frames.push(Images[`chest/${i}`]);
        }

        this.animatedChest = AnimatedSprite.fromFrames(frames);
        this.animatedChest.anchor.set(0.5);
        this.animatedChest.animationSpeed = 0.25;
        this.animatedChest.loop = false;
        this.animatedChest.visible = false;

        this.animatedChest.onFrameChange = (frame: number) => {
            if (frame === 1) {
                this.coins.visible = true;
                anime({
                    targets: this.coins.scale,
                    x: 1,
                    y: 1,
                    duration: 250,
                    easing: 'easeInOutSine',
                });

                anime({
                    targets: this.coins,
                    alpha: 1,
                    duration: 250,
                    easing: 'easeInOutSine',
                });
            }
        };
        this.addChild(this.animatedChest);
    }
}
