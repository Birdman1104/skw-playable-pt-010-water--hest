import anime from 'animejs';
import { AnimatedSprite, Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

export class Chest extends Container {
    private staticChest: Sprite;
    private animatedChest: AnimatedSprite;
    private algae: Sprite[] = [];

    constructor() {
        super();
        this.build();
    }

    public dropAlgae(): void {
        this.algae.forEach((algae) => {
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
                },
            });
        });
    }

    private build(): void {
        this.buildStaticSprite();
        this.buildAlgae();
        this.buildAnimatedChest();
    }

    private buildStaticSprite(): void {
        this.staticChest = makeSprite({ texture: Images['chest/0'], anchor: { x: 0.5, y: 0.5 } });
        this.addChild(this.staticChest);
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
        this.animatedChest.animationSpeed = 0.05;
        this.animatedChest.loop = false;
        this.animatedChest.visible = false;

        // this.animatedChest.play();
        console.warn('this.animatedChest', this.animatedChest);

        // this.animatedChest.onComplete = () => {
        //     this.animatedChest.destroy();
        // };
        this.animatedChest.onFrameChange = (frame: number) => {
            // add coins on 3rd frame
        };
        this.addChild(this.animatedChest);
    }
}
