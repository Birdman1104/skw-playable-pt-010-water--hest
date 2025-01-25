import anime from 'animejs';
import { Container, Sprite } from 'pixi.js';
import { Images } from '../../assets';
import { makeSprite } from '../../utils';

export class PirateHead extends Container {
    private head: Sprite;

    private bottomEyelids: Sprite;
    private topEyelids: Sprite;

    private mouthClosed: Sprite;
    private mouthPleased: Sprite;
    private mouthSad: Sprite;
    private mouthScared: Sprite;

    private pupil: Sprite;

    constructor() {
        super();

        this.build();
    }

    public idle(): void {
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
        anime({
            targets: this.pupil,
            x: [3, 1],
            y: [-4, -6],
            duration: 600,
            delay: 500,
            direction: 'alternate',
            easing: 'linear',
            loop: true,
        });
    }

    public openEyes(): void {
        this.topEyelids.alpha = 0;
        this.bottomEyelids.alpha = 0;
    }

    public scared(): void {
        this.showMouth(this.mouthScared, true);
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

        this.mouthPleased = makeSprite({ texture: Images['pirate/mouth_pleased'] });
        this.addChild(this.mouthPleased);

        this.mouthSad = makeSprite({ texture: Images['pirate/mouth_sad'] });
        this.addChild(this.mouthSad);

        this.mouthScared = makeSprite({ texture: Images['pirate/mouth_scared'] });
        this.addChild(this.mouthScared);
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
                        easing: 'easeInSine',
                    });
                } else {
                    anime({
                        targets: m,
                        alpha: 0,
                        duration: 300,
                        easing: 'easeOutSine',
                        complete: () => {
                            m.visible = false;
                        },
                    });
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
        return [this.mouthScared, this.mouthClosed, this.mouthPleased, this.mouthSad];
    }
}
