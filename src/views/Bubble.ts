import anime from 'animejs';
import { Container, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

const SCALE = 0.75;

export class Bubble extends Container {
    private _isOccupied: boolean = false;
    private bkg: Sprite;
    private icon: Sprite;
    private type: string = '';

    constructor() {
        super();

        this.build();
    }

    public get isOccupied() {
        return this._isOccupied;
    }

    public disable(): void {
        this.bkg.interactive = false;
    }

    public hide() {
        anime({
            targets: this.scale,
            x: 0,
            y: 0,
            duration: 300,
            easing: 'easeOutBack',
        });
    }

    public show(type: string) {
        this.type = type;
        this.updateIcon(type);
        anime({
            targets: this.scale,
            x: SCALE,
            y: SCALE,
            duration: 300,
            easing: 'easeOutBack',
            complete: () => {
                this.bkg.interactive = true;
            },
        });
    }

    public updateIcon(icon: string) {
        this.icon.texture = Texture.from(Images[`bubbles/${icon}`]);
        this.icon.anchor.set(0.5);
        this._isOccupied = true;
    }

    public reset() {
        this._isOccupied = false;
    }

    private build() {
        this.bkg = makeSprite({ texture: Images['bubbles/bubble'], anchor: { x: 0.5, y: 0.5 } });
        this.bkg.interactive = true;
        this.bkg.on('pointerdown', (e) => {
            //
            this.emit('click', this.type);
        });
        this.addChild(this.bkg);

        this.icon = new Sprite();
        this.addChild(this.icon);

        this.scale.set(0);
    }
}
