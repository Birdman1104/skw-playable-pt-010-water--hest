import { BubbleModel, BubbleType } from './BubbleModel';
import { Match3Model } from './Match3Model';
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

    private _match3: Match3Model;

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

    public get match3(): Match3Model {
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
        this.bubble1 = new BubbleModel(BUBBLES_ORDER[this.currentBubbleIndex]);
        this.currentBubbleIndex++;
        this.bubble2 = new BubbleModel(BUBBLES_ORDER[this.currentBubbleIndex]);
        this.currentBubbleIndex++;
    }

    public bubbleClick(type: string): void {
        if (this.bubble1.type === type) {
            this.bubble1 = new BubbleModel(BUBBLES_ORDER[this.currentBubbleIndex]);
        } else if (this.bubble2.type === type) {
            this.bubble2 = new BubbleModel(BUBBLES_ORDER[this.currentBubbleIndex]);
        }

        this.currentBubbleIndex++;

        this._match3 = new Match3Model(type as BubbleType);
    }
}
