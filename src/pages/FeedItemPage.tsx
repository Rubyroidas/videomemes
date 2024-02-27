import {MouseEventHandler, TouchEventHandler, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {AppTitle, BasicLink} from '../components/App.styles';
import {consoleLog, imageLoadPromise} from '../utils';
import {useApi} from '../services/apiContext';
import {FeedItem, Point, Size} from '../types';
import {PlayButton} from '../components/PhrasesEditor/PhraseEditor.styles';
import {PlayIcon} from '../icons/PlayIcon';
import styled from '@emotion/styled';

const VideoContainer = styled.div<Size>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    position: relative;

    @media (max-width: 480px) {
        width: 100vw;
        height: ${props => props.height / props.width * 100}vw;
    }
`;
const Video = styled.video`
    width: 100%;
`;

export const FeedItemPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const [item, setItem] = useState<FeedItem | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [size, setSize] = useState<Size>({width: 0, height: 0});

    const handleVideoClick: MouseEventHandler = (e) => {
        consoleLog('click');
        const video = e.target as HTMLVideoElement;
        if (video.paused) {
            video.play();
            setIsVideoPlaying(true);
        } else {
            video.pause();
            setIsVideoPlaying(false);
        }
    };

    useEffect(() => {
        if (typeof params.id !== 'string') {
            return;
        }

        const parsedId = parseInt(params.id, 10);
        consoleLog('parsedId', parsedId);
        if (isNaN(parsedId)) {
            navigate('/feed');
            return;
        }

        const load = async() => {
            const data = await api.getFeedItem(parsedId);
            consoleLog('item data', data);
            setItem(data);

            const img = document.createElement('img') as HTMLImageElement;
            img.crossOrigin = 'anonymous';
            img.src = data.snapshot;
            await imageLoadPromise(img);
            const sz: Size = {
                width: img.naturalWidth,
                height: img.naturalHeight,
            };
            consoleLog(sz);
            setSize(sz);
        };
        load();
    }, [params.id]);
    consoleLog(params);

    if (!item) {
        return null;
    }

    const playButtonPosition: Point = {
        x: 50,
        y: 50,
    };

    return (
        <div>
            <BasicLink to="/">go home</BasicLink>
            <AppTitle>Video</AppTitle>
            <VideoContainer {...size}>
                <Video
                    onClick={handleVideoClick}
                    onTouchEnd={(handleVideoClick as unknown) as TouchEventHandler}
                    controls={true}
                    loop={false}
                    src={`${item.url}#t=0.01`}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    controlsList="nofullscreen"
                    playsInline={true}
                    preload="auto"
                    crossOrigin="anonymous"
                />
                <PlayButton
                    position={playButtonPosition}
                    visible={size.width > 0 && !isVideoPlaying}
                >
                    <PlayIcon/>
                </PlayButton>
            </VideoContainer>
        </div>
    );
};
