import { BubbleModel, BubbleType } from './BubbleModel';
import { Match3Model } from './Match3Model';
import { ObservableModel } from './ObservableModel';

export enum BoardState {
    Unknown,
    PirateFalls,
    Idle,
    ShowMatch3,
    SwordMatch3,
    SwordActions,
    KeyMatch3,
    KeyActions,
    BombMatch3,
    BombActions,
}

export const BUBBLES_ORDER = [BubbleType.Sword, BubbleType.Bomb, BubbleType.Key, BubbleType.Ship];

export class BoardModel extends ObservableModel {
    private _bubble1: BubbleModel | null;
    private _bubble2: BubbleModel | null;

    private _state: BoardState = BoardState.Unknown;

    private _match3: Match3Model | null;

    private currentBubbleIndex = 0;

    constructor() {
        super('BoardModel');

        this.makeObservable();
    }

    public get state(): BoardState {
        return this._state;
    }

    public set state(value: BoardState) {
        this._state = value;
    }

    public get bubble1(): BubbleModel | null {
        return this._bubble1;
    }

    public set bubble1(value: BubbleModel | null) {
        this._bubble1 = value;
    }

    public get bubble2(): BubbleModel | null {
        return this._bubble2;
    }

    public set bubble2(value: BubbleModel | null) {
        this._bubble2 = value;
    }

    public get match3(): Match3Model | null {
        return this._match3;
    }

    public set match3(value: Match3Model) {
        this._match3 = value;
    }

    public setState(value: BoardState): void {
        this._state = value;
    }

    public initialize(): void {
        this._state = BoardState.PirateFalls;
    }

    public initBubbles(): void {
        console.warn(BUBBLES_ORDER[0], BUBBLES_ORDER[1]);

        this.bubble1 = new BubbleModel(BUBBLES_ORDER[0]);
        this.bubble2 = new BubbleModel(BUBBLES_ORDER[1]);
    }

    public bubbleClick(type: string): void {
        BUBBLES_ORDER.splice(BUBBLES_ORDER.indexOf(type as BubbleType), 1);

        console.warn(BUBBLES_ORDER);

        this.bubble1 = null;
        this.bubble2 = null;
        this.state = BoardState.ShowMatch3;

        this._match3 = new Match3Model(type as BubbleType);
    }

    public match3Complete(): void {
        console.warn('BoardModel.match3Complete');

        this._match3 = null;

        this.initBubbles();
    }
}
