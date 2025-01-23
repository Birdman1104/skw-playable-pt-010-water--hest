export const AdModelEvents = {
    StatusUpdate: 'AdModelStatusUpdate',
    CtaUpdate: 'AdModelCtaUpdate',
    SoundUpdate: 'AdModelSoundUpdate',
    HintUpdate: 'AdModelHintUpdate',
};

export const BoardModelEvents = {
    StateUpdate: 'BoardModelStateUpdate',
    Bubble1Update: 'BoardModelBubble1Update',
    Bubble2Update: 'BoardModelBubble2Update',
};

export const BubbleModelEvents = {
    TypeUpdate: 'BubbleModelTypeUpdate',
    IsSolvedUpdate: 'BubbleModelIsSolvedUpdate',
    IsShowingUpdate: 'BubbleModelIsShowingUpdate',
};

export const CtaModelEvents = { VisibleUpdate: 'CtaModelVisibleUpdate' };

export const GameModelEvents = {
    StateUpdate: 'GameModelStateUpdate',
    IsTutorialUpdate: 'GameModelIsTutorialUpdate',
    BoardUpdate: 'GameModelBoardUpdate',
};

export const HeadModelEvents = { GameModelUpdate: 'HeadModelGameModelUpdate', AdUpdate: 'HeadModelAdUpdate' };

export const HintModelEvents = { StateUpdate: 'HintModelStateUpdate', VisibleUpdate: 'HintModelVisibleUpdate' };

export const SoundModelEvents = { StateUpdate: 'SoundModelStateUpdate' };
