import {useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import styled from '@emotion/styled';
import {useTranslation} from 'react-i18next';

import {DownloadVideoButton} from '../components/FragmentsEditor/DownloadVideoButton';
import {Header, Icon, ResultVideo} from '../components/FragmentsEditor/FragmentEditor.styles';
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
    const {t} = useTranslation();
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

    const handleEditFragments = useCallback(() => {
        store.generatedVideo = undefined;
        navigate('/edit-fragments');
    }, []);

    if (!store.generatedVideo) {
        return null;
    }

    const today = new Date();
    const yy = today.getFullYear().toString().substring(2, 4);
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    const shortUuid = (store.scenario?.uuid ?? '').substring(0, 8);
    const downloadFileName = `memely.net_${yy}${mm}${dd}_${shortUuid}.mp4`;

    return (
        <Wrapper>
            <Header>
                <Button onClick={handleEditFragments}>
                    <Icon>
                        <RedoIcon/>
                    </Icon>
                    {t('generatedVideoPage.returnToEditButton')}
                </Button>
                <DownloadVideoButton data={store.generatedVideo} fileName={downloadFileName}>
                    <Icon>
                        <DownloadIcon/>
                    </Icon>
                    {t('generatedVideoPage.downloadButton')}
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
