import { BubbleType } from './BubbleModel';
import { ObservableModel } from './ObservableModel';

const boardConfig = {
    ship: {
        grid: [
            ['orange', 'pink', 'blue', 'green'],
            ['pink', 'orange', 'blue', 'green'],
            ['orange', 'green', 'pink', 'blue'],
        ],
        size: 'large',
        rows: 4,
        cols: 3,
        elements: 4,
        startX: -185,
        startY: -275,
        tileSize: 185,
    },
    key: {
        grid: [
            ['orange', 'pink', 'blue', 'green'],
            ['pink', 'orange', 'blue', 'green'],
            ['orange', 'green', 'pink', 'blue'],
        ],
        size: 'large',
        rows: 4,
        cols: 3,
        elements: 4,
        startX: -185,
        startY: -275,
        tileSize: 185,
    },

    bomb: {
        grid: [
            ['red', 'blue', 'red'],
            ['blue', 'red', 'blue'],
        ],
        size: 'small',
        rows: 3,
        cols: 2,
        elements: 2,
        startX: -85,
        startY: -170,
        tileSize: 170,
    },
    sword: {
        grid: [
            ['green', 'orange', 'green'],
            ['orange', 'green', 'orange'],
        ],
        size: 'small',
        rows: 3,
        cols: 2,
        elements: 2,
        startX: -85,
        startY: -170,
        tileSize: 170,
    },
};

export class Match3Model extends ObservableModel {
    private _config: any;

    constructor(private type: BubbleType) {
        super('Match3Model');

        this._config = boardConfig[type];
        this.makeObservable();
    }

    public get config(): any {
        return this._config;
    }

    public get rows(): number {
        return this._config.rows;
    }

    public get cols(): number {
        return this._config.cols;
    }

    public get elements(): number {
        return this._config.elements;
    }

    public get startX(): number {
        return this._config.startX;
    }

    public get startY(): number {
        return this._config.startY;
    }

    public get tileSize(): number {
        return this._config.tileSize;
    }

    public get grid(): string[][] {
        return this._config.grid;
    }

    public get size(): string {
        return this._config.size;
    }
}
