import {MouseEventHandler, TouchEventHandler, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';

import {AppTitle} from '../components/App.styles';
import {consoleError, consoleLog} from '../utils';
import {useApi} from '../services/apiContext';
import {FeedItem, Point, Size} from '../types';
import {PlayButton} from '../components/PhrasesEditor/PhraseEditor.styles';
import {PlayIcon} from '../icons/PlayIcon';
import styled from '@emotion/styled';
import {formatSizes} from '../statics';
import {HomeIcon} from '../icons/HomeIcon';

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
    const videoRef = useRef<HTMLVideoElement>(null);
    const params = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const [item, setItem] = useState<FeedItem | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handleVideoClick: MouseEventHandler = (e) => {
        const video = e.target as HTMLVideoElement;
        if (video.paused) {
            video.play();
            setIsVideoPlaying(true);
        } else {
            video.pause();
            setIsVideoPlaying(false);
        }
    };
    const handleVideoEnded = () => {
        setIsVideoPlaying(false);
    };

    useEffect(() => {
        if (typeof params.id !== 'string') {
            return;
        }

        const parsedId = params.id;
        const load = async() => {
            const data = await api.getFeedItem(parsedId);
            consoleLog('FEED ITEM', data);
            setItem(data);
        };
        load()
            .then(() => {})
            .catch((e) => {
                consoleError(e);
                navigate('/feed');
            });
    }, [params.id]);

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        const videoEl = videoRef.current;
        videoEl.addEventListener('ended', handleVideoEnded);

        return () => {
            videoEl.removeEventListener('ended', handleVideoEnded);
        }
    }, [item]);

    if (!item) {
        return null;
    }

    const size: Size = formatSizes[item.format];
    const playButtonPosition: Point = {
        x: 50,
        y: 50,
    };

    return (
        <div>
            <AppTitle>
                <Link to="/">
                    <HomeIcon/>
                </Link>
                Video
            </AppTitle>
            <VideoContainer {...size}>
                <Video
                    ref={videoRef}
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
