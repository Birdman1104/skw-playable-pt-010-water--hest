import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { getGameViewGridConfig } from '../configs/gridConfigs/GameViewGC';
import { GameModelEvents } from '../events/ModelEvents';
import { BoardModel } from '../models/BoardModel';
import { BoardView } from './BoardView';

export class GameView extends PixiGrid {
    private board: BoardView;

    constructor() {
        super();

        lego.event.on(GameModelEvents.BoardUpdate, this.onBoardUpdate, this);
        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getGameViewGridConfig();
    }

    public update(): void {
        //
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        //
    }

    private onBoardUpdate(board: BoardModel | null): void {
        board ? this.buildBoard() : this.destroyBoard();
    }

    private buildBoard() {
        this.board = new BoardView();
        this.setChild('board', this.board);
    }

    private destroyBoard(): void {
        this.board.destroy();
    }
}
