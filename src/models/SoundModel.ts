import { ObservableModel } from './ObservableModel';

export enum SoundState {
    Unknown = 'Unknown',
    On = 'On',
    Off = 'Off',
}

export class SoundModel extends ObservableModel {
    private _state: SoundState;

    public constructor() {
        super('SoundModel');

        this._state = SoundState.Unknown;
        this.makeObservable();
    }

    get state(): SoundState {
        return this._state;
    }

    set state(value: SoundState) {
        this._state = value;
    }

    public initialize(): void {
        this._state = SoundState.On;
    }

    public toggle(): void {
        this._state = this._state === SoundState.On ? SoundState.Off : SoundState.On;
    }
}
