import {useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import styled from '@emotion/styled';

import {DownloadVideoButton} from '../components/PhrasesEditor/DownloadVideoButton';
import {Header, Icon, ResultVideo} from '../components/PhrasesEditor/PhraseEditor.styles';
import {DownloadIcon} from '../icons/DownloadIcon';
import {useStore} from '../store';
import {Button} from '../components/App.styles';
import {RedoIcon} from '../icons/RedoIcon';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const DownloadResultPage = observer(() => {
    const store = useStore();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!store.generatedVideo) {
            navigate('/');
        }
    });

    useEffect(() => {
        if (!videoRef.current || !store.generatedVideo) {
            return;
        }

        const video = videoRef.current;
        const clear = () => {
            URL.revokeObjectURL(video.src);
            video.removeEventListener('load', clear);
        };
        video.src = URL.createObjectURL(store.generatedVideo);
        video.addEventListener('load', clear);
    }, [store.generatedVideo]);

    const handleEditPhrases = useCallback(() => {
        store.generatedVideo = undefined;
        navigate('/edit-phrases');
    }, []);

    if (!store.generatedVideo) {
        return null;
    }

    return (
        <Wrapper>
            <Header>
                <Button onClick={handleEditPhrases}>
                    <Icon>
                        <RedoIcon/>
                    </Icon>
                    Edit
                </Button>
                <DownloadVideoButton data={store.generatedVideo}>
                    <Icon>
                        <DownloadIcon/>
                    </Icon>
                    Download
                </DownloadVideoButton>
            </Header>
            <ResultVideo
                ref={videoRef}
                controls={true}
                loop={false}
                disablePictureInPicture={true}
                disableRemotePlayback={true}
                controlsList="nofullscreen"
                playsInline={true}
                preload="auto"
                crossOrigin="anonymous"
            />
        </Wrapper>
    );
});
