import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { delayRunnable, makeSprite } from '../utils';
import { MatchSprite } from './MatchSprite';

const BOARD_SIZES = {
    small: { rows: 3, cols: 2, elements: 2 }, // 3x2 board
    large: { rows: 4, cols: 3, elements: 4 }, // 4x3 board
};

const configs = [
    [
        ['orange', 'pink', 'blue', 'green'],
        ['pink', 'orange', 'blue', 'green'],
        ['orange', 'green', 'pink', 'blue'],
    ],

    [
        ['red', 'blue', 'red'],
        ['blue', 'red', 'blue'],
    ],
    [
        ['green', 'orange', 'green'],
        ['orange', 'green', 'orange'],
    ],
];

const START_POS = {
    large: { x: -185, y: -275 },
    small: { x: -85, y: -170 },
};
// const arr =;

export const tileSize = {
    large: 185,
    small: 170,
};

export class MatchThreeBoard extends Container {
    private draggedElement: MatchSprite | null;
    private dragStartPosition: any;
    private dragStartBoardPosition: { row: number; col: number } = { row: -1, col: -1 };
    private config: { rows: number; cols: number; elements: number };
    private data: any;
    private bkg: Sprite;
    private board: (MatchSprite | null)[][] = [];

    constructor(private size: 'small' | 'large', private i: number) {
        super();

        this.build();
    }

    public hide(): void {
        anime({
            targets: this.scale,
            x: 0,
            y: 0,
            duration: 300,
            easing: 'easeOutQuad',
        });
    }

    private build(): void {
        this.bkg = makeSprite({ texture: Images[this.size === 'small' ? 'game/small_board' : 'game/big_board'] });
        this.bkg.anchor.set(0.5);
        this.addChild(this.bkg);

        const { x: sx, y: sy } = START_POS[this.size];
        const arr = configs[this.i];
        this.config = BOARD_SIZES[this.size];
        for (let i = 0; i < this.config.cols; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.config.rows; j++) {
                const element = arr[i][j];

                const sprite = new MatchSprite(element);
                sprite.x = sx + i * tileSize[this.size];
                sprite.y = sy + j * tileSize[this.size];

                sprite.on('down', (e) => this.onDragStart(e, sprite));
                sprite.on('end', () => this.onDragEnd());
                sprite.on('move', () => this.onDragMove());
                sprite.originalPosition = { x: sprite.x, y: sprite.y };

                sprite.boardPosition = { row: j, col: i };
                this.addChild(sprite);

                this.board[i][j] = sprite;
            }
        }
    }

    private onDragStart(event, sprite) {
        this.data = event.data;
        this.draggedElement = sprite;
        this.dragStartPosition = event.data.getLocalPosition(this);

        this.dragStartBoardPosition.row = sprite.boardPosition.row;
        this.dragStartBoardPosition.col = sprite.boardPosition.col;
    }

    private onDragMove() {
        if (this.draggedElement) {
            const newPosition = this.data.getLocalPosition(this);
            this.draggedElement.x = newPosition.x;
            this.draggedElement.y = newPosition.y;
        }
    }

    private onDragEnd() {
        if (this.draggedElement) {
            const dragEndPosition = this.data.getLocalPosition(this);

            const dx = dragEndPosition.x - this.dragStartPosition.x;
            const dy = dragEndPosition.y - this.dragStartPosition.y;

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx < 50 && absDy < 50) {
                this.resetElementPosition(this.draggedElement);
                this.draggedElement = null;
                this.dragStartPosition = null;
                return;
            }

            let targetRow = this.dragStartBoardPosition.row;
            let targetCol = this.dragStartBoardPosition.col;

            if (absDx > absDy) {
                if (dx > 0 && targetCol < this.config.cols - 1) {
                    targetCol++;
                } else if (dx < 0 && targetCol > 0) {
                    targetCol--;
                }
            } else {
                if (dy > 0 && targetRow < this.config.rows - 1) {
                    targetRow++;
                } else if (dy < 0 && targetRow > 0) {
                    targetRow--;
                }
            }
            if (targetRow !== this.dragStartBoardPosition.row || targetCol !== this.dragStartBoardPosition.col) {
                this.swapElements(
                    this.dragStartBoardPosition.row,
                    this.dragStartBoardPosition.col,
                    targetRow,
                    targetCol,
                );
            } else {
                this.resetElementPosition(this.draggedElement);
            }

            this.draggedElement = null;
            this.dragStartPosition = null;
        }
    }

    private swapElements(row1, col1, row2, col2) {
        const element1 = this.board[col1][row1];
        const element2 = this.board[col2][row2];

        if (!element1 || !element2) {
            if (element1) {
                const tempX = element1.originalPosition.x;
                const tempY = element1.originalPosition.y;

                anime({
                    targets: element1,
                    x: tempX,
                    y: tempY,
                    duration: 100,
                    easing: 'easeInOutSine',
                });
            }
            if (element2) {
                const tempX = element2.originalPosition.x;
                const tempY = element2.originalPosition.y;

                anime({
                    targets: element2,
                    x: tempX,
                    y: tempY,
                    duration: 100,
                    easing: 'easeInOutSine',
                });
            }
            return;
        }

        const tempX1 = element1.originalPosition.x;
        const tempY1 = element1.originalPosition.y;

        const tempX2 = element2.originalPosition.x;
        const tempY2 = element2.originalPosition.y;

        anime({
            targets: element1,
            x: tempX2,
            y: tempY2,
            duration: 100,
            easing: 'easeInOutSine',
        });
        anime({
            targets: element2,
            x: tempX1,
            y: tempY1,
            duration: 100,
            easing: 'easeInOutSine',
            complete: () => {
                element1.originalPosition = { x: element1.x, y: element1.y };
                element2.originalPosition = { x: element2.x, y: element2.y };

                this.board[col1][row1] = element2;
                this.board[col2][row2] = element1;

                element1.boardPosition = { row: row2, col: col2 };
                element2.boardPosition = { row: row1, col: col1 };

                const matches = this.getMatches();
                if (matches.length === 0) {
                    anime({
                        targets: element1,
                        x: tempX1,
                        y: tempY1,
                        duration: 100,
                        easing: 'easeInOutSine',
                    });
                    anime({
                        targets: element2,
                        x: tempX2,
                        y: tempY2,
                        duration: 100,
                        easing: 'easeInOutSine',
                        complete: () => {
                            element1.originalPosition = { x: element1.x, y: element1.y };
                            element2.originalPosition = { x: element2.x, y: element2.y };

                            this.board[col1][row1] = element1;
                            this.board[col2][row2] = element2;

                            element1.boardPosition = { row: row1, col: col1 };
                            element2.boardPosition = { row: row2, col: col2 };
                        },
                    });

                    return;
                }

                delayRunnable(0.3, () => {
                    const cb = () => {
                        if (this.board.every((col) => col.every((el) => el === null))) {
                            delayRunnable(0.3, () => {
                                this.emit('won');
                            });
                        }
                    };
                    matches.forEach((element, i) => {
                        this.board[element.boardPosition.col][element.boardPosition.row] = null;

                        element.explode(i === matches.length - 1 ? cb : null);
                    });

                    for (let col = 0; col < this.config.cols; col++) {
                        let newColumn: (MatchSprite | null)[] = this.board[col].filter((element) => element !== null);
                        while (newColumn.length < this.board[col].length) {
                            newColumn.unshift(null);
                        }
                        for (let row = 0; row < this.config.rows; row++) {
                            this.board[col][row] = newColumn[row];
                            if (this.board[col][row]) {
                                // @ts-ignore
                                this.board[col][row].boardPosition = { row: row, col: col };
                            }
                        }
                    }

                    const { x: sx, y: sy } = START_POS[this.size];

                    this.board.forEach((col, i) => {
                        col.forEach((element, j) => {
                            if (element) {
                                const x = sx + i * tileSize[this.size];
                                const y = sy + j * tileSize[this.size];

                                anime({
                                    targets: element,
                                    x,
                                    y,
                                    duration: 100,
                                    easing: 'easeInOutSine',
                                });

                                element.originalPosition = { x, y };
                            }
                        });
                    });
                });
            },
        });
    }

    private getMatches(): MatchSprite[] {
        const matches: MatchSprite[] = [];
        const { cols, rows } = this.config;

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                if (row + 1 > rows - 1 || row + 2 > rows - 1) {
                    continue;
                }
                const el1 = this.board[col][row];
                const el2 = this.board[col][row + 1];
                const el3 = this.board[col][row + 2];

                if (!el1 || !el2 || !el3) {
                    continue;
                }

                if (el1.type === el2.type && el2.type === el3.type) {
                    matches.push(el1, el2, el3);
                }
            }
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (col + 1 > cols - 1 || col + 2 > cols - 1) {
                    continue;
                }
                const el1 = this.board[col][row];
                const el2 = this.board[col + 1][row];
                const el3 = this.board[col + 2][row];

                if (!el1 || !el2 || !el3) {
                    continue;
                }

                if (el1.type === el2.type && el2.type === el3.type) {
                    matches.push(el1, el2, el3);
                }
            }
        }

        return matches.filter((v, i, a) => a.indexOf(v) === i);
    }

    private resetElementPosition(element) {
        element.x = element.originalPosition.x;
        element.y = element.originalPosition.y;
    }
}
