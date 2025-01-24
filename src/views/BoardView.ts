import { lego } from '@armathai/lego';
import anime from 'animejs';
import { AnimatedSprite, Container, Point, Rectangle, Sprite, Texture } from 'pixi.js';
import { Images } from '../assets';
import { BoardEvents, ForegroundEvents } from '../events/MainEvents';
import { BoardModelEvents } from '../events/ModelEvents';
import { BoardState } from '../models/BoardModel';
import { delayRunnable, lp, makeSprite } from '../utils';
import { Bomb } from './Bomb';
import { Bubble } from './Bubble';
import { Chest } from './Chest';
import { Pirate } from './pirate/Pirate';

const BOUNDS = {
    L: { x: -425, y: -350, w: 850, h: 750 },
    P: { x: -425, y: -800, w: 850, h: 1600 },
};

const PIRATE = {
    initialPos: { x: -200, y: -300 },
    targetPos: { x: -200, y: 280 },
    scale: 0.7,
};

const BUBBLE_POS = [
    { x: -120, y: -180 },
    { x: 120, y: -80 },
];

const easing = 'easeInOutSine';
export class BoardView extends Container {
    private bkg: Sprite;
    private pirate: Pirate;
    private waterSplash: AnimatedSprite;
    private chest: Chest;
    private bubble1: Bubble;
    private bubble2: Bubble;

    private chosenBubble: string;
    private animationElement: Sprite;

    private state: BoardState;

    constructor() {
        super();

        lego.event
            .on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this)
            .on(BoardModelEvents.ChosenBubbleUpdate, this.onChosenBubbleUpdate, this)
            .on(BoardModelEvents.Bubble1Update, this.onBubble1Update, this)
            .on(BoardModelEvents.Bubble2Update, this.onBubble2Update, this)
            .on(ForegroundEvents.Match3Complete, this.onMatch3Complete, this)
            .on('HintScaleDown', this.onHintScaleDown, this);

        this.build();
    }

    get viewName() {
        return 'BoardView';
    }

    public get boardState(): BoardState {
        return this.state;
    }

    public getHintPositions(): Point[] {
        return BUBBLE_POS.map((pos) => this.toGlobal(new Point(pos.x, pos.y)));
    }

    public getBounds(): Rectangle {
        const { x, y, w, h } = lp(BOUNDS.L, BOUNDS.P);
        return new Rectangle(x, y, w, h);
    }

    public rebuild(): void {
        //
    }

    private onHintScaleDown(index) {
        const targets = index === 1 ? this.bubble2 : this.bubble1;

        anime({
            targets: targets.scale,
            x: '+=0.2',
            y: '+=0.2',
            duration: 500,
            easing: 'easeInOutCubic',
            direction: 'alternate',
        });
    }

    private build(): void {
        this.buildBkg();
        this.buildBubbles();
        this.buildPirate();
        this.buildWaterSplash();

        this.buildChest();
        this.addWater();

        this.animationElement = new Sprite();
        this.addChild(this.animationElement);

        // drawBounds(this);
    }

    private buildChest(): void {
        this.chest = new Chest();
        this.chest.position.set(250, 220);
        this.chest.scale.set(1.5);
        this.addChild(this.chest);
        this.chest.float();
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
        [this.bubble1, this.bubble2].forEach((b, i) => {});

        this.bubble1 = new Bubble();
        this.bubble1.position.set(BUBBLE_POS[0].x, BUBBLE_POS[0].y);
        this.bubble1.on('click', (type) => {
            this.bubble2.disable();
            lego.event.emit(BoardEvents.BubbleClick, type);
        });
        this.addChild(this.bubble1);

        this.bubble2 = new Bubble();
        this.bubble2.position.set(BUBBLE_POS[1].x, BUBBLE_POS[1].y);
        this.bubble2.on('click', (type) => {
            this.bubble1.disable();

            lego.event.emit(BoardEvents.BubbleClick, type);
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

    private buildWaterSplash(): void {
        const frames: any[] = [];
        for (let i = 0; i <= 10; i++) {
            frames.push(Images[`water/${i}`]);
        }

        this.waterSplash = AnimatedSprite.fromFrames(frames);
        this.waterSplash.anchor.set(0.5);
        this.waterSplash.position.set(PIRATE.targetPos.x, PIRATE.targetPos.y);
        this.waterSplash.animationSpeed = 0.5;
        this.waterSplash.loop = false;
        this.waterSplash.visible = false;
        this.waterSplash.onComplete = () => {
            this.waterSplash.visible = false;
        };
        this.addChild(this.waterSplash);
    }

    private onBoardStateUpdate(state: BoardState): void {
        console.warn(BoardState[state]);
        this.state = state;
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
                this.waterSplash.visible = true;
                this.waterSplash.play();
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

    private onChosenBubbleUpdate(type: string): void {
        this.chosenBubble = type;
        anime.remove(this.bubble1.scale);
        anime.remove(this.bubble2.scale);
        this.bubble1.scale.set(1);
        this.bubble2.scale.set(1);
    }

    private onMatch3Complete(): void {
        if (this.chosenBubble === 'bomb') {
            const bomb = new Bomb();
            bomb.play();
            this.addChild(bomb);

            anime({
                targets: bomb.scale,
                x: 0.5,
                y: 0.5,
                duration: 500,
                easing,
            });
            anime({
                targets: bomb,
                x: 165,
                y: 255,
                duration: 500,
                easing,
                complete: () => {
                    this.chest.dropAlgae();
                    lego.event.emit(BoardEvents.AnimationComplete);
                },
            });
        } else if (this.chosenBubble === 'sword') {
            this.animationElement.texture = Texture.from(Images[`game/${this.chosenBubble}`]);

            const { anchor, position, scale, angle } = config[this.chosenBubble];
            this.animationElement.anchor.set(anchor.x, anchor.y);
            this.animationElement.position.set(position.x, position.y);
            this.animationElement.scale.set(scale.x, scale.y);
            this.animationElement.angle = angle;
            this.animationElement.alpha = 0;

            anime({
                targets: this.animationElement,
                alpha: 1,
                easing: 'easeInOutSine',
                duration: 300,
            });
            this.animateSword();
        } else if (this.chosenBubble === 'key') {
            this.animationElement.texture = Texture.from(Images[`game/${this.chosenBubble}`]);
            const { anchor, position, scale, angle } = config[this.chosenBubble];
            this.animationElement.anchor.set(anchor.x, anchor.y);
            this.animationElement.position.set(position.x, position.y);
            this.animationElement.scale.set(scale.x, scale.y);
            this.animationElement.angle = angle;
            this.animationElement.alpha = 1;
            this.animateKey();
        }
    }

    private animateSword(): void {
        anime({
            targets: this.animationElement.scale,
            x: -0.7,
            y: 0.7,
            duration: 200,
            easing,
            complete: () => {
                anime({
                    targets: this.animationElement,
                    x: -68,
                    y: 180,
                    duration: 200,
                    easing,
                    complete: () => {
                        anime({
                            targets: this.animationElement,
                            angle: 70,
                            duration: 200,
                            easing,
                            loop: 5,
                            direction: 'alternate',
                            complete: () => {
                                this.chest.dropAlgae();
                                anime({
                                    targets: this.animationElement,
                                    alpha: 0,
                                    duration: 300,
                                    easing,
                                    complete: () => {
                                        lego.event.emit(BoardEvents.AnimationComplete);
                                    },
                                });
                                anime({
                                    targets: this.animationElement.scale,
                                    x: '+=0.2',
                                    y: '+=0.2',
                                    duration: 300,
                                    easing,
                                });
                            },
                        });
                    },
                });
            },
        });
    }

    private animateKey(): void {
        const delay = 150;
        anime({
            targets: this.animationElement.scale,
            x: 0.3,
            y: 0.3,
            duration: 300,
            delay,
            easing,
        });
        anime({
            targets: this.animationElement,
            x: 130,
            y: 240,
            duration: 300,
            delay,
            easing,
            complete: () => {
                anime({
                    targets: this.animationElement.scale,
                    y: -0.3,
                    duration: 200,
                    direction: 'alternate',
                    easing,
                    complete: () => {
                        this.chest.dropAlgae();
                        this.chest.open();
                        anime({
                            targets: this.animationElement,
                            alpha: 0,
                            duration: 300,
                            easing,
                            complete: () => {
                                lego.event.emit(BoardEvents.AnimationComplete);
                            },
                        });
                        anime({
                            targets: this.animationElement.scale,
                            x: '+=0.2',
                            y: '+=0.2',
                            duration: 300,
                            easing,
                        });
                    },
                });
            },
        });
    }
}

const config = {
    sword: {
        anchor: { x: 0.9, y: 0.9 },
        position: { x: -150, y: 192 },
        scale: { x: -1, y: 1 },
        angle: 0,
    },
    bomb: {
        anchor: { x: 0.5, y: 0.5 },
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        angle: 0,
    },
    key: {
        anchor: { x: 0.5, y: 0.5 },
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        angle: 0,
    },
};
