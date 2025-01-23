import anime from 'animejs';
import { AnimatedSprite, Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { callIfExists, makeSprite } from '../utils';

const tint = {
    orange: 0xffa500,
    blue: 0x0000ff,
    green: 0x00ff00,
    pink: 0x800080,
    red: 0xff0000,
};

export class MatchSprite extends Container {
    public originalPosition: { x: number; y: number };
    public boardPosition: { row: number; col: number };
    private sprite: Sprite;
    private splash: AnimatedSprite;

    constructor(private _type: string) {
        super();

        this.build();
    }

    public get type(): string {
        return this._type;
    }

    public explode(cb?): void {
        this.splash.visible = true;
        this.splash.play();
        anime({
            targets: this.sprite.scale,
            x: 1.2,
            y: 1.2,
            duration: 200,
            easing: 'easeInOutSine',
            complete: () => {
                callIfExists(cb);
            },
        });
        anime({
            targets: this.sprite,
            alpha: 0,
            duration: 200,
            easing: 'easeInOutSine',
        });
    }

    private build(): void {
        this.buildSprite();
        this.buildSplash();
    }

    private buildSplash(): void {
        const frames: any[] = [];
        for (let i = 1; i <= 10; i++) {
            frames.push(Images[`spark/${i}`]);
        }

        this.splash = AnimatedSprite.fromFrames(frames);
        this.splash.anchor.set(0.5);
        this.splash.scale.set(1.2);
        this.splash.animationSpeed = 0.5;
        this.splash.loop = false;
        this.splash.visible = false;
        this.splash.tint = tint[this.type];

        this.splash.onComplete = () => {
            this.splash.destroy();
        };

        this.addChild(this.splash);
    }

    private buildSprite(): void {
        this.sprite = makeSprite({ texture: Images[`elements/${this.type}`] });
        this.sprite.interactive = true;
        this.sprite.on('pointerdown', (e) => {
            this.sprite.scale.set(0.85);
            this.emit('down', e);
        });

        this.sprite.on('pointerup', (e) => {
            this.sprite.scale.set(1);
            this.emit('end', e);
        });
        this.sprite.on('pointerupoutside', (e) => {
            this.sprite.scale.set(1);
            this.emit('end', e);
        });
        this.sprite.on('pointermove', (e) => this.emit('move'));

        this.addChild(this.sprite);
    }
}
