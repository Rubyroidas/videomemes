import {MouseEventHandler, TouchEventHandler, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import shortUuid from 'short-uuid';
import {useTranslation} from 'react-i18next';

import {AppTitle, Button} from '../components/App.styles';
import {consoleError, consoleLog} from '../utils';
import {useApi} from '../services/apiContext';
import {FeedItem, Format, Point, Size} from '../types';
import {PlayButton} from '../components/FragmentsEditor/FragmentEditor.styles';
import {PlayIcon} from '../icons/PlayIcon';
import styled from '@emotion/styled';
import {formatSizes} from '../statics';
import {HomeIcon} from '../icons/HomeIcon';
import {useStore} from '../store';
import {VIDEO_TITLE_ENABLED} from '../config';
import {AnalyticsEvent, sendAnalyticsEvent} from '../services/analytics';

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
    const {t} = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const params = useParams();
    const navigate = useNavigate();
    const api = useApi();
    const store = useStore();
    const [item, setItem] = useState<FeedItem | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handleVideoClick: MouseEventHandler = (e) => {
        const video = e.target as HTMLVideoElement;
        sendAnalyticsEvent(AnalyticsEvent.FeedItem_VideoViewClicked, {
            item_id: item?.id,
            play: video.paused,
        });
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
    const handleReuseVideoClick = () => {
        if (!item) {
            return;
        }
        sendAnalyticsEvent(AnalyticsEvent.FeedItem_ConfigReused, {
            item_id: item?.id,
        });
        store.scenario = {
            uuid: shortUuid().uuid(),
            format: Format.InstagramStory,
            fragments: [],
        };
        store.scenario!.fragments = item.config.fragments.map(item => ({
            id: shortUuid().uuid(),
            type: item.type,
            collectionId: item.collectionId,
            fragmentId: item.fragmentId,
            text: item.text ?? 'Your text here',
            textSize: item.textSize,
            imageSize: item.imageSize,
        }));
        navigate(VIDEO_TITLE_ENABLED ? '/title-setup' : '/edit-scenario');
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
    const coeff = 600 / size.width;
    size.width *= coeff;
    size.height *= coeff;
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
                {t('feedItem.title')}
            </AppTitle>
            <Button onClick={handleReuseVideoClick}>{t('feedItem.reuseConfigButton')}</Button>
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
