import anime from 'animejs';
import { Container, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

const SCALE = 0.75;

export class Bubble extends Container {
    private _isOccupied: boolean = false;
    private bkg: Sprite;
    private icon: Sprite;

    constructor() {
        super();

        this.build();
    }

    public get isOccupied() {
        return this._isOccupied;
    }

    public show(icon: string) {
        this.updateIcon(icon);
        anime({
            targets: this.scale,
            x: SCALE,
            y: SCALE,
            duration: 300,
            easing: 'easeOutBack',
        });
    }

    public updateIcon(icon: string) {
        if (this.isOccupied) return;
        this.icon.texture = Texture.from(Images[`game/${icon}`]);
        this._isOccupied = true;
    }

    public reset() {
        this._isOccupied = false;
    }

    private build() {
        this.bkg = makeSprite({ texture: Images['game/bubble'], anchor: { x: 0.5, y: 0.5 } });
        this.addChild(this.bkg);

        this.icon = makeSprite({ texture: Images['game/sword'], anchor: { x: 0.5, y: 0.5 } });
        this.addChild(this.icon);

        this.scale.set(0);
    }
}
