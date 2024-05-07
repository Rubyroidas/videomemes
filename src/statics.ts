import {Format, Size} from './types';

export const formatSizes: Record<Format, Size> = {
    [Format.InstagramStory]: {
        width: 1080,
        height: 1920
    },
    [Format.InstagramPost]: {
        width: 1080,
        height: 1080
    },
    [Format.YoutubeVideo]: {
        width: 1280,
        height: 720
    },
};
