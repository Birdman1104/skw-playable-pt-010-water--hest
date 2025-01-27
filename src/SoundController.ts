import { lego } from '@armathai/lego';
import { Howl } from 'howler';
import { BoardEvents, MainGameEvents } from './events/MainEvents';
import { BoardModelEvents, SoundModelEvents } from './events/ModelEvents';
import { BoardState } from './models/BoardModel';
import { SoundState } from './models/SoundModel';
import { CLICK_SOUND } from './sounds/click';
import { CRY } from './sounds/cry';
import { EXPLOSION_SOUND } from './sounds/explosion';
import { FITIL_SOUND } from './sounds/fitil';
import { LAUGH } from './sounds/laugh';
import { LOCK_OPEN } from './sounds/lockOpen';
import { MERGE } from './sounds/merge';
import { SWORD_CUT_SOUND } from './sounds/swordCut';
import { THEME } from './sounds/theme';

const VOLUMES = {
    click: 1.5,
    cry: 1,
    merge: 1,
    laugh: 1,
    swordCut: 1,
    fitil: 3,
    lockOpen: 2,
    theme: 0.2,
    explosion: 0.8,
};

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
            .on('PlayCry', this.playCry, this)
            .on('PlayMerge', this.playMerge, this)
            .on('playLaugh', this.playLaugh, this)
            .on(MainGameEvents.MuteUpdate, this.focusChange, this)
            .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this);
    }

    public loadSounds(): void {
        this.sounds.click = new Howl({ src: CLICK_SOUND, volume: VOLUMES.click });
        this.sounds.cry = new Howl({ src: CRY });
        this.sounds.merge = new Howl({ src: MERGE });
        this.sounds.laugh = new Howl({ src: LAUGH });
        this.sounds.swordCut = new Howl({ src: SWORD_CUT_SOUND });
        this.sounds.fitil = new Howl({ src: FITIL_SOUND, volume: VOLUMES.fitil });
        this.sounds.lockOpen = new Howl({ src: LOCK_OPEN, volume: VOLUMES.lockOpen });
        this.sounds.theme = new Howl({ src: THEME, loop: true, volume: VOLUMES.theme });
        this.sounds.explosion = new Howl({ src: EXPLOSION_SOUND, volume: VOLUMES.explosion });
    }

    private playClick(): void {
        this.sounds.click.volume(VOLUMES.click);
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

    private playLaugh(): void {
        this.sounds.laugh.play();
    }

    private playLockOpen(): void {
        this.sounds.theme.volume(1.2);
        this.sounds.lockOpen.play();
    }

    private playCry(): void {
        this.sounds.cry.play();
    }

    private playMerge(): void {
        this.sounds.merge.play();
    }

    private playTheme(): void {
        this.sounds.theme.volume(VOLUMES.theme);
        this.sounds.theme.play();
    }

    private focusChange(outOfFocus: boolean): void {
        if (this.isMutedFromIcon) return;
        for (const [key, value] of Object.entries(this.sounds)) {
            value.volume(outOfFocus ? 0 : VOLUMES[key] || 1);
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
            value.volume(VOLUMES[key] || 1);
        }
    }
}

const SoundController = new SoundControl();
export default SoundController;
