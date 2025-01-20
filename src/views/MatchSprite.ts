import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { callIfExists, makeSprite } from '../utils';

export class MatchSprite extends Container {
    public originalPosition: { x: number; y: number };
    public boardPosition: { row: number; col: number };
    private sprite: Sprite;

    constructor(private _type: string) {
        super();

        this.build();
    }

    public get type(): string {
        return this._type;
    }

    public explode(cb?): void {
        anime({
            targets: this.sprite.scale,
            x: 0,
            y: 0,
            duration: 200,
            easing: 'easeInOutSine',
            complete: () => {
                callIfExists(cb);
            },
        });
    }

    private build(): void {
        this.sprite = makeSprite({ texture: Images[`elements/${this.type}`] });
        this.sprite.interactive = true;
        this.sprite.on('pointerdown', (e) => this.emit('down', e));

        this.sprite.on('pointerup', (e) => this.emit('end', e));
        this.sprite.on('pointerupoutside', (e) => this.emit('end', e));
        this.sprite.on('pointermove', (e) => this.emit('move'));

        this.addChild(this.sprite);
    }
}
