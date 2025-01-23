import { ObservableModel } from './ObservableModel';

export enum BubbleType {
    Bomb = 'bomb',
    Key = 'key',
    Sword = 'sword',
    Ship = 'ship',
}

export class BubbleModel extends ObservableModel {
    private _isSolved: boolean = false;
    private _isShowing: boolean = false;

    constructor(private _type: BubbleType) {
        super('BubbleModel');

        this.makeObservable();
    }

    public get type(): BubbleType {
        return this._type;
    }

    public set type(value: BubbleType) {
        this._type = value;
    }

    public get isSolved(): boolean {
        return this._isSolved;
    }

    public set isSolved(value: boolean) {
        this._isSolved = value;
    }

    public get isShowing(): boolean {
        return this._isShowing;
    }

    public set isShowing(value: boolean) {
        this._isShowing = value;
    }
}
