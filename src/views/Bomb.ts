import anime from 'animejs';
import { AnimatedSprite, Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

export class Bomb extends Container {
    private bomb: Sprite;
    private spark: Sprite;
    private explosion: AnimatedSprite;

    constructor() {
        super();

        this.build();
    }

    public play(): void {
        this.playSpark();
    }

    private playSpark(): void {
        anime({
            targets: this.spark,
            x: -180,
            y: 0,
            duration: 300,
            easing: 'linear',
            complete: () => {
                anime({
                    targets: this.spark,
                    x: -100,
                    y: 15,
                    duration: 200,
                    easing: 'linear',
                    complete: () => {
                        this.explosion.visible = true;
                        this.explosion.play();
                        anime({
                            targets: this.bomb.scale,
                            x: '+=0.2',
                            y: '+=0.2',
                            duration: 200,
                            easing: 'linear',
                        });
                        anime({
                            targets: this.bomb,
                            alpha: 0,
                            duration: 200,
                            easing: 'linear',
                        });
                        anime({
                            targets: this.spark.scale,
                            x: 0,
                            y: 0,
                            duration: 100,
                            easing: 'linear',
                            complete: () => {
                                this.spark.destroy();
                            },
                        });
                    },
                });
            },
        });
    }

    private build(): void {
        this.bomb = makeSprite({ texture: Images['game/bomb'], anchor: { x: 0.5, y: 0.5 } });
        this.addChild(this.bomb);

        this.spark = makeSprite({
            texture: Images['game/spark'],
            anchor: { x: 0.5, y: 0.5 },
            position: { x: -250, y: -100 },
        });
        this.addChild(this.spark);

        const frames: any[] = [];
        for (let i = 0; i <= 8; i++) {
            frames.push(Images[`explosion/${i}`]);
        }
        this.explosion = AnimatedSprite.fromFrames(frames);
        this.explosion.scale.set(6);
        this.explosion.anchor.set(0.5);
        this.explosion.animationSpeed = 0.35;
        this.explosion.loop = false;
        this.explosion.visible = false;
        this.explosion.onComplete = () => {
            this.explosion.visible = false;
        };
        this.addChild(this.explosion);
    }
}
