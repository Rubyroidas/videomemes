import styled from '@emotion/styled';
import {useRef, useState} from 'react';

import {CollectionItem, Point} from '../../types';
import {PlayButton} from '../PhrasesEditor/PhraseEditor.styles';
import {PlayIcon} from '../../icons/PlayIcon';

export const Wrapper = styled.div`
    grid-column: 1 / 4;
    grid-row: 1 / 4;
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: auto;

    & > img {
        width: 100%;
        pointer-events: none;
    }

    & > video {
        pointer-events: none;
    }
`;

type Props = {
    collectionItem: CollectionItem;
}
export const SnapshotPreview = (props: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [startedPlaying, setStartedPlaying] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const {collectionItem} = props;

    const handleClick = () => {
        setStartedPlaying(true);
        if (!videoRef.current) {
            return;
        }

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsVideoPlaying(true);
        } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        }
    };

    const playButtonPosition: Point = {
        x: 50,
        y: 50,
    };

    return (
        <Wrapper
            onClick={handleClick}
        >
            {!startedPlaying && (
                <img
                    alt={collectionItem.text}
                    src={collectionItem.snapshot}
                    crossOrigin="anonymous"
                />
            )}
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: startedPlaying ? '' : 'none'
                }}
                controls={false}
                loop={false}
                autoPlay={false}
                src={`${collectionItem.preview}#t=0.01`}
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                controlsList="nofullscreen"
                playsInline={true}
                preload="auto"
                crossOrigin="anonymous"
            />
            <PlayButton
                position={playButtonPosition}
                visible={!isVideoPlaying}
            >
                <PlayIcon/>
            </PlayButton>
        </Wrapper>
    )
};
