import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import anime from 'animejs';
import { Container } from 'pixi.js';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { ForegroundEvents } from '../events/MainEvents';
import { AdModelEvents, BoardModelEvents, SoundModelEvents } from '../events/ModelEvents';
import { AdStatus } from '../models/AdModel';
import { HintModel } from '../models/HintModel';
import { Match3Model } from '../models/Match3Model';
import { SoundModel, SoundState } from '../models/SoundModel';
import { HintView } from './HintView';
import { MatchThreeBoard } from './MatchThreeBoard';
import { Sound } from './SoundView';

export class ForegroundView extends PixiGrid {
    private sound: Sound;
    private hint: HintView | null;
    private match3Wrapper: Container;

    constructor() {
        super();

        lego.event
            .on(BoardModelEvents.Match3Update, this.onMatch3Update, this)
            .on(AdModelEvents.StatusUpdate, this.onStatusUpdate, this)
            .on(AdModelEvents.SoundUpdate, this.onSoundUpdate, this)
            .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this)
            .on(AdModelEvents.HintUpdate, this.onHintUpdate, this);

        this.build();
    }

    get viewName(): string {
        return 'ForegroundView';
    }

    public getGridConfig(): ICellConfig {
        return getForegroundGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        this.match3Wrapper = new Container();
        this.setChild('match3', this.match3Wrapper);
    }

    private onStatusUpdate(status: AdStatus): void {
        switch (status) {
            case AdStatus.Game:
                this.build();
                break;

            case AdStatus.PreCta:
                //
                break;

            default:
                break;
        }
    }

    private onHintUpdate(hint: HintModel | null): void {
        hint ? this.buildHint() : this.destroyHint();
    }

    private buildHint(): void {
        this.hint = new HintView();
        this.addChild(this.hint);
    }

    private destroyHint(): void {
        this.hint?.destroy();
        this.hint = null;
    }

    private onSoundUpdate(sound: SoundModel): void {
        if (sound) {
            this.sound = new Sound();
            this.sound.mutedUpdate(sound.state === SoundState.Off);
            this.setChild('sound', this.sound);
        }
    }

    private onSoundStateUpdate(soundState: SoundState): void {
        this.sound.mutedUpdate(soundState === SoundState.Off);
    }

    private onMatch3Update(match3: Match3Model): void {
        console.warn('onMatch3Update', match3);
        const match3Board = new MatchThreeBoard(match3);

        this.match3Wrapper.width = match3Board.width;
        this.match3Wrapper.height = match3Board.height;
        this.match3Wrapper.addChild(match3Board);

        this.rebuild();

        match3Board.scale.set(0);
        anime({
            targets: match3Board.scale,
            x: 1,
            y: 1,
            duration: 300,
            easing: 'easeOutBack',
        });

        match3Board.on('won', () => {
            anime({
                targets: match3Board.scale,
                x: 0,
                y: 0,
                duration: 300,
                easing: 'easeOutBack',
                complete: () => {
                    match3Board.destroy();
                    this.emit(ForegroundEvents.Match3Complete);
                },
            });
        });
    }
}
