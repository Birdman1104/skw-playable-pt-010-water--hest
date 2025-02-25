interface Window {
    game: any;
    gameStart_: boolean;
    createGame: () => void;
    installCTA: () => void;
    gameReadyCall: () => void;
    CTACallImitation: () => void;
    soundMute: (value: boolean) => void;
}

type AssetNameAndPath = {
    name: string;
    path: string;
};

declare namespace GlobalMixins {
    interface DisplayObjectEvents {
        hideComplete: [string];
        showComplete: [string];
        click: [string];
    }
}

type SpriteConfig = {
    texture: string;
    tint?: number;
    scale?: { x: number; y: number };
    anchor?: { x: number; y: number };
    position?: { x: number; y: number };
};

type CardConfig = {
    question: string;
    answers: string[];
};

type PointLike = {
    x: number;
    y: number;
};
