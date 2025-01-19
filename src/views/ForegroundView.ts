import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { AdModelEvents, SoundModelEvents } from '../events/ModelEvents';
import { AdStatus } from '../models/AdModel';
import { HintModel } from '../models/HintModel';
import { SoundModel, SoundState } from '../models/SoundModel';
import { HintView } from './HintView';
import { Sound } from './SoundView';

export class ForegroundView extends PixiGrid {
    private sound: Sound;
    private hint: HintView | null;

    constructor() {
        super();

        lego.event
            .on(AdModelEvents.StatusUpdate, this.onStatusUpdate, this)
            .on(AdModelEvents.SoundUpdate, this.onSoundUpdate, this)
            .on(SoundModelEvents.StateUpdate, this.onSoundStateUpdate, this)
            .on(AdModelEvents.HintUpdate, this.onHintUpdate, this);
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
        //
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
}
