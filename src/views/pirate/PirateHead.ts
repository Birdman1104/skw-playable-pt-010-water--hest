import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../../assets';
import { makeSprite } from '../../utils';

export class PirateHead extends Container {
    private head: Sprite;

    private bottomEyelids: Sprite;
    private topEyelids: Sprite;

    private mouthClosed: Sprite;
    private mouthMid: Sprite;
    private mouthOpen: Sprite;
    private mouthPleased: Sprite;
    private mouthSad: Sprite;

    private pupil: Sprite;

    constructor() {
        super();

        this.build();
    }

    public idle(): void {
        this.showMouth(this.mouthClosed);
        this.topEyelids.alpha = 0;
        this.bottomEyelids.alpha = 0;
        anime({
            targets: [this.topEyelids, this.bottomEyelids],
            alpha: 1,
            duration: 300,
            delay: 1000,
            direction: 'alternate',
            easing: 'linear',
            loop: true,
        });
    }

    public pleased(): void {
        this.showMouth(this.mouthPleased, true);
    }

    public sad(): void {
        this.showMouth(this.mouthSad, true);
    }

    public closeMouth(): void {
        this.showMouth(this.mouthClosed, true);
    }

    public closeMid(): void {
        this.showMouth(this.mouthMid, true);
    }

    private build(): void {
        this.head = makeSprite({ texture: Images['pirate/head'] });
        this.addChild(this.head);

        this.pupil = makeSprite({ texture: Images['pirate/pupil'] });
        this.addChild(this.pupil);

        this.bottomEyelids = makeSprite({ texture: Images['pirate/eyelid_bottom'] });
        this.addChild(this.bottomEyelids);

        this.topEyelids = makeSprite({ texture: Images['pirate/eyelid_top'] });
        this.addChild(this.topEyelids);

        this.mouthClosed = makeSprite({ texture: Images['pirate/mouth_closed'] });
        this.addChild(this.mouthClosed);

        this.mouthMid = makeSprite({ texture: Images['pirate/mouth_mid'] });
        this.addChild(this.mouthMid);

        this.mouthOpen = makeSprite({ texture: Images['pirate/mouth_open'] });
        this.addChild(this.mouthOpen);

        this.mouthPleased = makeSprite({ texture: Images['pirate/mouth_pleased'] });
        this.addChild(this.mouthPleased);

        this.mouthSad = makeSprite({ texture: Images['pirate/mouth_sad'] });
        this.addChild(this.mouthSad);
    }

    private showMouth(mouth: Sprite, animate = false): void {
        if (animate) {
            this.getMouths().forEach((m) => {
                if (m === mouth) {
                    m.visible = true;
                    anime({
                        targets: m,
                        alpha: 1,
                        duration: 300,
                        easing: 'linear',
                    });
                } else {
                    m.visible = false;
                    m.alpha = 0;
                }
            });
        } else {
            this.getMouths().forEach((m) => {
                m.visible = m === mouth;
                m.alpha = m === mouth ? 1 : 0;
            });
        }
    }

    private getMouths(): Sprite[] {
        return [this.mouthClosed, this.mouthMid, this.mouthOpen, this.mouthPleased, this.mouthSad];
    }
}
