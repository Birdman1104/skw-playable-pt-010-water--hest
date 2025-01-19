import { Container, Sprite } from 'pixi.js';
import { Images } from '../assets';
import { makeSprite } from '../utils';
import { MatchSprite } from './MatchSprite';

const BOARD_SIZES = {
    small: { rows: 2, cols: 3, elements: 2 }, // 3x2 board
    large: { rows: 3, cols: 4, elements: 4 }, // 4x3 board
};

const arr = [
    ['red', 'blue'],
    ['blue', 'red'],
    ['red', 'blue'],
];

export const tileSize = 170;

export class MatchThreeBoard extends Container {
    private draggedElement: MatchSprite | null;
    private dragStartPosition: any;
    private dragStartBoardPosition: { row: number; col: number } = { row: -1, col: -1 };
    private config: { rows: number; cols: number; elements: number };
    private data: any;
    private bkg: Sprite;
    private board: MatchSprite[][] = [];

    constructor(private size: 'small' | 'large') {
        super();

        this.build();
    }

    private build(): void {
        this.bkg = makeSprite({ texture: Images[this.size === 'small' ? 'game/small_board' : 'game/big_board'] });
        this.bkg.anchor.set(0);
        this.addChild(this.bkg);

        this.config = BOARD_SIZES[this.size];
        for (let i = 0; i < this.config.cols; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.config.rows; j++) {
                const element = arr[i][j];

                const sprite = new MatchSprite(element);
                sprite.x = j * tileSize + tileSize / 2;
                sprite.y = i * tileSize + tileSize / 2;

                sprite.on('down', (e) => this.onDragStart(e, sprite));
                sprite.on('end', () => this.onDragEnd());
                sprite.on('move', () => this.onDragMove());
                sprite.on('down', (e) => this.onDragStart(e, sprite));
                sprite.originalPosition = { x: sprite.x, y: sprite.y };

                sprite.boardPosition = { row: i, col: j };
                this.addChild(sprite);

                this.board[i][j] = sprite;
            }
        }
    }

    private onDragStart(event, sprite) {
        this.data = event.data;
        this.draggedElement = sprite;
        this.dragStartPosition = event.data.getLocalPosition(this);
        console.warn(sprite.boardPosition);

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
            const dragEndPosition = this.data.getLocalPosition(this.parent);

            const dx = dragEndPosition.x - this.dragStartPosition.x;
            const dy = dragEndPosition.y - this.dragStartPosition.y;

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

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

            console.warn(targetRow, this.dragStartBoardPosition.row, targetCol, this.dragStartBoardPosition.col);

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
        const element1 = this.board[row1][col1];
        const element2 = this.board[row2][col2];

        const tempX = element1.originalPosition.x;
        const tempY = element1.originalPosition.y;
        element1.x = element2.originalPosition.x;
        element1.y = element2.originalPosition.y;
        element2.x = tempX;
        element2.y = tempY;

        element1.originalPosition = { x: element1.x, y: element1.y };
        element2.originalPosition = { x: element2.x, y: element2.y };

        this.board[row1][col1] = element2;
        this.board[row2][col2] = element1;

        element1.boardPosition = { row: row2, col: col2 };
        element2.boardPosition = { row: row1, col: col1 };

        // Add match-checking logic here
        // if (!this.checkMatches()) {
        //     // If no match, revert swap
        //     setTimeout(() => {
        //         this.swapElements(row2, col2, row1, col1);
        //     }, 300); // Delay for visual feedback
        // }
    }

    private checkMatches(): boolean {
        return false;
    }

    private resetElementPosition(element) {
        element.x = element.originalPosition.x;
        element.y = element.originalPosition.y;
    }
}
