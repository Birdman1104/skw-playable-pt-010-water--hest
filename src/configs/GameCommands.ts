import { lego } from '@armathai/lego';
import { BoardState } from '../models/BoardModel';
import Head from '../models/HeadModel';
import { setBoardStateCommand, takeToStoreCommand } from './Commands';

export const onPirateFallCompleteCommand = () => {
    lego.command.payload(BoardState.Idle).execute(setBoardStateCommand);
};

export const onBoardStateUpdateCommand = (state: BoardState) => {
    switch (state) {
        case BoardState.Idle:
            Head.gameModel?.board?.initBubbles();
            break;

        default:
            break;
    }
};

export const onBubbleClickCommand = (type: string) => {
    if (Head.gameModel?.board?.completed) {
        lego.command.execute(takeToStoreCommand);
        return;
    }
    Head.gameModel?.board?.bubbleClick(type);
};

export const onMatch3CompleteCommand = () => {
    Head.gameModel?.board?.match3Complete();
};
