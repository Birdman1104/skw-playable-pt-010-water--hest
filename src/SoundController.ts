import { lego } from '@armathai/lego';
import { Howl } from 'howler';
import { BoardEvents, MainGameEvents } from './events/MainEvents';
import { BoardModelEvents, SoundModelEvents } from './events/ModelEvents';
import { BoardState } from './models/BoardModel';
import { SoundState } from './models/SoundModel';
import { BOARD_COMPLETE } from './sounds/boardComplete';
import { CLICK_SOUND } from './sounds/click';
import { EXPLOSION_SOUND } from './sounds/explosion';
import { FITIL_SOUND } from './sounds/fitil';
import { LOCK_OPEN } from './sounds/lockOpen';
import { SWORD_CUT_SOUND } from './sounds/swordCut';
import { THEME } from './sounds/theme';

class SoundControl {
    private sounds: { [key: string]: Howl };
    private isMutedFromIcon = false;

    public constructor() {
        this.sounds = {};

        lego.event
            .on(BoardModelEvents.StateUpdate, this.onBoardStateUpdate, this)
            .on(BoardEvents.BubbleClick, this.playClick, this)
            .on('MatchItemClick', this.playClick, this)
            .on('swordSound', this.playSword, this)
            .on('playExplosion', this.playExplosion, this)
            .on('playFitil', this.playFitil, this)
            .on('playLockOpen', this.playLockOpen, this)
            .on('playBoardComplete', this.playBoardComplete, this)
            .on(MainGameEvents.MuteUpdate, this.focusChange, this)
            .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this);
    }

    public loadSounds(): void {
        this.sounds.click = new Howl({ src: CLICK_SOUND, volume: 1.5 });
        this.sounds.swordCut = new Howl({ src: SWORD_CUT_SOUND });
        this.sounds.fitil = new Howl({ src: FITIL_SOUND });
        this.sounds.lockOpen = new Howl({ src: LOCK_OPEN });
        this.sounds.BoardComplete = new Howl({ src: BOARD_COMPLETE });
        this.sounds.theme = new Howl({ src: THEME, loop: true, volume: 0.2 });
        this.sounds.explosion = new Howl({ src: EXPLOSION_SOUND, volume: 0.8 });
    }

    private playClick(): void {
        this.sounds.theme.volume(1.2);
        this.sounds.click.play();
    }

    private playSword(): void {
        this.sounds.swordCut.play();
    }

    private playExplosion(): void {
        this.sounds.explosion.play();
    }

    private playFitil(): void {
        this.sounds.fitil.play();
    }

    private playLockOpen(): void {
        this.sounds.theme.volume(1.2);
        this.sounds.lockOpen.play();
    }

    private playBoardComplete(): void {
        this.sounds.BoardComplete.play();
    }

    private playTheme(): void {
        this.sounds.theme.volume(0.2);
        this.sounds.theme.play();
    }

    private focusChange(outOfFocus: boolean): void {
        if (this.isMutedFromIcon) return;
        for (const [key, value] of Object.entries(this.sounds)) {
            value.volume(outOfFocus ? 0 : key === 'theme' ? 0.2 : key === 'explosion' ? 0.8 : 1.2);
        }
    }

    private onBoardStateUpdate(state: BoardState): void {
        state === BoardState.PirateFalls && this.playTheme();
    }

    private onSoundStateUpdate(state: SoundState): void {
        state === SoundState.On ? this.unmute() : this.mute();
    }

    private mute(): void {
        this.isMutedFromIcon = true;
        for (const [key, value] of Object.entries(this.sounds)) {
            value.volume(0);
        }
    }

    private unmute(): void {
        this.isMutedFromIcon = false;
        for (const [key, value] of Object.entries(this.sounds)) {
            value.volume(key === 'theme' ? 0.2 : key === 'explosion' ? 0.8 : 1.2);
        }
    }
}

const SoundController = new SoundControl();
export default SoundController;
