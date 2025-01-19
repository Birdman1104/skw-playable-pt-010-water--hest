import { lego } from '@armathai/lego';
import { Container, Point, Rectangle, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { GameModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';
import { drawBounds, lp, makeSprite } from '../utils';

const BOUNDS = {
    L: { x: -750, y: -100, w: 1500, h: 850 },
    P: { x: -425, y: -800, w: 850, h: 1600 },
};

export class BoardView extends Container {
    private bkg: Sprite;

    constructor() {
        super();

        lego.event.on(GameModelEvents.StateUpdate, this.onGameStateUpdate, this);

        this.build();
    }

    get viewName() {
        return 'BoardView';
    }

    public getBounds(): Rectangle {
        const { x, y, w, h } = lp(BOUNDS.L, BOUNDS.P);
        return new Rectangle(x, y, w, h);
    }

    public rebuild(): void {
        //
    }

    private build(): void {
        this.buildBkg();

        drawBounds(this);
    }

    private buildBkg(): void {
        this.bkg = makeSprite({ texture: Images['game/bkg'], scale: new Point(1.5, 1.5) });
        this.addChild(this.bkg);
    }

    private onGameStateUpdate(state: GameState): void {
        //
    }
}
