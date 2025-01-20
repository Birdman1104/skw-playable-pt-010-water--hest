import { lego } from '@armathai/lego';
import { Container, Point, Rectangle, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { GameModelEvents } from '../events/ModelEvents';
import { GameState } from '../models/GameModel';
import { lp, makeSprite } from '../utils';
import { MatchThreeBoard } from './MatchThreeBoard';
import { Pirate } from './Pirate';

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
        this.buildPirate();
        this.buildMatch3();

        // drawBounds(this);
    }

    private buildBkg(): void {
        this.bkg = makeSprite({ texture: Images['game/bkg'], scale: new Point(1.5, 1.5) });
        this.addChild(this.bkg);
    }

    private buildPirate(): void {
        const pirate = new Pirate();
        pirate.position.set(0, 0);
        this.addChild(pirate);
    }

    private buildMatch3(): void {
        const pos = [
            { x: -400, y: 300 },
            { x: 50, y: 300 },
            { x: 450, y: 300 },
        ];

        const type = ['large', 'small', 'small'];
        for (let i = 0; i < 3; i++) {
            const board = new MatchThreeBoard(type[i] as 'large' | 'small', i);
            board.position.set(pos[i].x, pos[i].y);
            this.addChild(board);
            board.scale.set(0.75);

            board.on('won', () => {
                board.hide();
            });
        }
    }

    private onGameStateUpdate(state: GameState): void {
        //
    }
}
