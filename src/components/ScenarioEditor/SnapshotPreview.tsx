import styled from '@emotion/styled';
import {useRef, useState} from 'react';

import {CollectionItem} from '../../types';

export const Wrapper = styled.div`
    grid-column: 1 / 4;
    grid-row: 1 / 4;
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    
    & > img {
        width: 100%;
    }
`;

type Props = {
    collectionItem: CollectionItem;
}
export const SnapshotPreview = (props: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [startedPlaying, setStartedPlaying] = useState(false);
    const {collectionItem} = props;

    const handleClick = () => {
        console.log('click');
        setStartedPlaying(true);
        if (!videoRef.current) {
            console.log('no video');
            return;
        }

        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    return (
        <Wrapper
            onClick={handleClick}
        >
            {!startedPlaying ? (
                <img
                    alt={collectionItem.text}
                    src={collectionItem.snapshot}
                    crossOrigin="anonymous"
                />
            ) : (
                <video
                    ref={videoRef}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    controls={false}
                    loop={false}
                    autoPlay={true}
                    src={`${collectionItem.preview}#t=0.01`}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    controlsList="nofullscreen"
                    playsInline={true}
                    preload="auto"
                    crossOrigin="anonymous"
                />
            )}
        </Wrapper>
    )
};
