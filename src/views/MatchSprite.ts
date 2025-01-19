import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';

export class MatchSprite extends Container {
    public originalPosition: { x: number; y: number };
    public boardPosition: { row: number; col: number };
    private sprite: Sprite;

    constructor(private type: string) {
        super();

        this.build();
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
