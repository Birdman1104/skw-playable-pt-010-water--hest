import { lego } from '@armathai/lego';
import { BoardEvents, MainGameEvents, SoundEvents, TakeMe } from '../events/MainEvents';
import { AdModelEvents, BoardModelEvents, GameModelEvents } from '../events/ModelEvents';
import {
    onAdStatusUpdateCommand,
    onGameStateUpdateCommand,
    onMainViewReadyCommand,
    onSoundToggleCommand,
    resizeCommand,
    takeToStoreCommand,
} from './Commands';
import {
    onBoardStateUpdateCommand,
    onBubbleClickCommand,
    onMatch3CompleteCommand,
    onPirateFallCompleteCommand,
} from './GameCommands';

export const mapCommands = () => {
    eventCommandPairs.forEach(({ event, command }) => {
        lego.event.on(event, command);
    });
};

export const unMapCommands = () => {
    eventCommandPairs.forEach(({ event, command }) => {
        lego.event.off(event, command);
    });
};

const eventCommandPairs = Object.freeze([
    {
        event: MainGameEvents.MainViewReady,
        command: onMainViewReadyCommand,
    },
    {
        event: AdModelEvents.StatusUpdate,
        command: onAdStatusUpdateCommand,
    },
    {
        event: GameModelEvents.StateUpdate,
        command: onGameStateUpdateCommand,
    },
    {
        event: MainGameEvents.Resize,
        command: resizeCommand,
    },
    {
        event: TakeMe.ToStore,
        command: takeToStoreCommand,
    },
    {
        event: SoundEvents.SoundToggle,
        command: onSoundToggleCommand,
    },
    {
        event: BoardEvents.FallComplete,
        command: onPirateFallCompleteCommand,
    },
    {
        event: BoardEvents.BubbleClick,
        command: onBubbleClickCommand,
    },
    {
        event: BoardModelEvents.StateUpdate,
        command: onBoardStateUpdateCommand,
    },
    {
        event: BoardEvents.AnimationComplete,
        command: onMatch3CompleteCommand,
    },
]);
