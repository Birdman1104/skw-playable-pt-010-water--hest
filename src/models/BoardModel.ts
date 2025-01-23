import { BubbleModel, BubbleType } from './BubbleModel';
import { ObservableModel } from './ObservableModel';

export enum BoardState {
    Unknown,
    PirateFalls,
    Idle,
    SwordMatch3,
    SwordActions,
    KeyMatch3,
    KeyActions,
    BombMatch3,
    BombActions,
}

export const BUBBLES_ORDER = [BubbleType.Sword, BubbleType.Bomb, BubbleType.Key, BubbleType.Ship];

export class BoardModel extends ObservableModel {
    private _bubble1: BubbleModel;
    private _bubble2: BubbleModel;

    private _state: BoardState = BoardState.Unknown;

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

    public get bubble1(): BubbleModel {
        return this._bubble1;
    }

    public set bubble1(value: BubbleModel) {
        this._bubble1 = value;
    }

    public get bubble2(): BubbleModel {
        return this._bubble2;
    }

    public set bubble2(value: BubbleModel) {
        this._bubble2 = value;
    }

    public setState(value: BoardState): void {
        this._state = value;
    }

    public initialize(): void {
        this._state = BoardState.PirateFalls;
    }

    public initBubbles(): void {
        this.bubble1 = new BubbleModel(BUBBLES_ORDER[0]);
        this.bubble2 = new BubbleModel(BUBBLES_ORDER[1]);
    }
}
