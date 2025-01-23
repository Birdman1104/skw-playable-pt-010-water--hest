import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Rectangle, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { BoardModelEvents } from '../events/ModelEvents';
import { BoardState } from '../models/BoardModel';
import { lp, makeSprite } from '../utils';
import { MatchThreeBoard } from './MatchThreeBoard';
import { Pirate } from './pirate/Pirate';

const BOUNDS = {
    L: { x: -750, y: -100, w: 1500, h: 850 },
    P: { x: -425, y: -800, w: 850, h: 1600 },
};

const PIRATE = {
    initialPos: { x: -100, y: -300 },
    targetPos: { x: -100, y: 196 },
    scale: 0.7,
};

export class BoardView extends Container {
    private bkg: Sprite;
    private pirate: Pirate;

    constructor() {
        super();

        lego.event.on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this);

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
        // this.buildMatch3();

        // drawBounds(this);
    }

    private buildBkg(): void {
        this.bkg = makeSprite({ texture: Images['game/bkg'], scale: { x: 1.5, y: 1.5 } });
        this.addChild(this.bkg);
    }

    private buildPirate(): void {
        const {
            initialPos: { x, y },
            scale,
        } = PIRATE;
        this.pirate = new Pirate();
        this.pirate.position.set(x, y);
        this.pirate.scale.set(scale);
        this.addChild(this.pirate);
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

    private onBoardStateUpdate(state: BoardState): void {
        console.warn('BoardView.onBoardStateUpdate', BoardState[state]);
        switch (state) {
            case BoardState.PirateFalls:
                this.onPirateFalls();
                break;

            default:
                break;
        }
    }

    private onPirateFalls(): void {
        const { x, y } = PIRATE.targetPos;
        this.pirate.fall();
        anime({
            targets: this.pirate,
            x,
            y,
            easing: 'easeInSine',
            duration: 500,
            complete: () => {
                this.pirate.idle();
                this.pirate.float();
            },
        });
    }
}
