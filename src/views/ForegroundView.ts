import { lego } from '@armathai/lego';
import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import anime from 'animejs';
import { Container, Graphics, Point } from 'pixi.js';
import { Images } from '../assets';
import { getForegroundGridConfig } from '../configs/gridConfigs/ForegroundViewGC';
import { ForegroundEvents, TakeMe } from '../events/MainEvents';
import { AdModelEvents, BoardModelEvents, SoundModelEvents } from '../events/ModelEvents';
import { AdStatus } from '../models/AdModel';
import { HintModel } from '../models/HintModel';
import { Match3Model } from '../models/Match3Model';
import { SoundModel, SoundState } from '../models/SoundModel';
import { makeSprite } from '../utils';
import { HintView } from './HintView';
import { MatchThreeBoard } from './MatchThreeBoard';
import { Sound } from './SoundView';

export class ForegroundView extends PixiGrid {
    private sound: Sound;
    private hint: HintView | null;
    private match3Wrapper: Container;
    private match3Board: MatchThreeBoard;
    private blocker: Graphics;

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

    public getHintPositions(): Point[] {
        return this.match3Board.getHintPositions();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        this.blocker = new Graphics();
        this.blocker.beginFill(0x000000, 1);
        this.blocker.drawRect(0, 0, 10, 10);
        this.blocker.endFill();
        this.blocker.alpha = 0;
        this.setChild('blocker', this.blocker);

        this.match3Wrapper = new Container();
        this.setChild('match3', this.match3Wrapper);

        const pcta = makeSprite({ texture: Images['game/pcta'] });
        pcta.interactive = true;
        pcta.on('pointerdown', () => {
            lego.event.emit(TakeMe.ToStore);
        });
        this.setChild('pcta', pcta);

        const logo = makeSprite({ texture: Images['game/logo'] });
        logo.interactive = true;
        logo.on('pointerdown', () => {
            lego.event.emit(TakeMe.ToStore);
        });
        this.setChild('logo', logo);
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
        if (!match3) {
            this.match3Wrapper.removeChild(this.match3Board);
            this.match3Board?.destroy();
            return;
        }

        this.match3Board = new MatchThreeBoard(match3);

        this.match3Wrapper.width = this.match3Board.width;
        this.match3Wrapper.height = this.match3Board.height;
        this.match3Wrapper.addChild(this.match3Board);

        this.rebuild();

        this.match3Board.scale.set(0);
        anime({
            targets: this.match3Board.scale,
            x: 1,
            y: 1,
            duration: 300,
            easing: 'easeOutBack',
        });
        anime({
            targets: this.blocker,
            alpha: 0.4,
            duration: 300,
            easing: 'easeOutBack',
        });

        this.match3Board.on('won', () => {
            anime({
                targets: this.match3Board.scale,
                x: 0,
                y: 0,
                duration: 300,
                easing: 'easeOutSine',
                complete: () => {
                    this.match3Board.destroy();
                    lego.event.emit(ForegroundEvents.Match3Complete);
                },
            });

            anime({
                targets: this.blocker,
                alpha: 0,
                duration: 300,
                easing: 'easeOutBack',
            });
        });
    }
}
