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

export class BoardModel extends ObservableModel {
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

    public initialize(): void {
        this._state = BoardState.PirateFalls;
    }
}
