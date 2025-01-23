import { lego } from '@armathai/lego';
import anime from 'animejs';
import { Container, Rectangle, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { BoardEvents } from '../events/MainEvents';
import { BoardModelEvents } from '../events/ModelEvents';
import { BoardState } from '../models/BoardModel';
import { delayRunnable, lp, makeSprite } from '../utils';
import { Bubble } from './Bubble';
import { Chest } from './Chest';
import { MatchThreeBoard } from './MatchThreeBoard';
import { Pirate } from './pirate/Pirate';

const BOUNDS = {
    L: { x: -750, y: -100, w: 1500, h: 850 },
    P: { x: -425, y: -800, w: 850, h: 1600 },
};

const PIRATE = {
    initialPos: { x: -200, y: -300 },
    targetPos: { x: -200, y: 230 },
    scale: 0.7,
};

export class BoardView extends Container {
    private bkg: Sprite;
    private pirate: Pirate;
    private chest: Chest;
    private bubbles: Bubble[] = [];
    private bubble1: Bubble;
    private bubble2: Bubble;

    constructor() {
        super();

        lego.event
            .on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this)
            .on(BoardModelEvents.Bubble1Update, this.onBubble1Update, this)
            .on(BoardModelEvents.Bubble2Update, this.onBubble2Update, this);
        // .on(BubbleModelEvents.IsShowingUpdate, this.onBubbleShowingUpdate, this);

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
        this.buildBubbles();
        this.buildPirate();

        this.buildChest();
        this.addWater();
        // this.buildMatch3();

        // drawBounds(this);
    }

    private buildChest(): void {
        this.chest = new Chest();
        this.chest.position.set(200, 200);
        this.chest.scale.set(1.5);
        this.addChild(this.chest);
    }

    private buildBkg(): void {
        this.bkg = makeSprite({ texture: Images['game/bkg'], scale: { x: 1.5, y: 1.5 } });
        this.addChild(this.bkg);
    }

    private addWater(): void {
        const water = makeSprite({
            texture: Images['pirate/water'],
            anchor: { x: 0.5, y: 0.5 },
            position: { x: 0, y: 430 },
        });
        this.addChild(water);
    }

    private buildBubbles(): void {
        const pos = [
            { x: -120, y: -370 },
            { x: 150, y: -200 },
        ];

        [this.bubble1, this.bubble2].forEach((b, i) => {});

        this.bubble1 = new Bubble();
        this.bubble1.position.set(pos[0].x, pos[0].y);
        this.bubble1.on('click', (type) => {
            lego.event.emit(BoardEvents.BubbleClick, type);
            this.bubble1.hide();
        });
        this.addChild(this.bubble1);

        this.bubble2 = new Bubble();
        this.bubble2.position.set(pos[1].x, pos[1].y);
        this.bubble2.on('click', (type) => {
            lego.event.emit(BoardEvents.BubbleClick, type);
            this.bubble2.hide();
        });
        this.addChild(this.bubble2);
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
                delayRunnable(0.3, () => {
                    lego.event.emit(BoardEvents.FallComplete);
                });
            },
        });
    }

    private onBubble1Update(bubbleModel): void {
        if (!bubbleModel) {
            this.bubble1?.hide();
        } else {
            this.bubble1?.show(bubbleModel.type);
        }
    }

    private onBubble2Update(bubbleModel): void {
        if (!bubbleModel) {
            this.bubble2?.hide();
        } else {
            this.bubble2?.show(bubbleModel.type);
        }
    }
}
