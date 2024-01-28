import {useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';

import {DownloadVideoButton} from '../components/PhrasesEditor/DownloadVideoButton';
import {Icon, ResultVideo} from '../components/PhrasesEditor/PhraseEditor.styles';
import {DownloadIcon} from '../icons/DownloadIcon';
import {useStore} from '../store';
import {Button} from '../components/App.styles';
import {RedoIcon} from '../icons/RedoIcon';

export const DownloadResultPage = observer(() => {
    const store = useStore();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!store.generatedVideo) {
            navigate('/edit-phrases');
        }
    });

    useEffect(() => {
        if (!videoRef.current || !store.generatedVideo) {
            return;
        }

        videoRef.current.src = URL.createObjectURL(store.generatedVideo);
    }, [store.generatedVideo]);

    const handleEditPhrases = useCallback(() => {
        store.generatedVideo = undefined;
        navigate('/edit-phrases')
    }, []);

    if (!store.generatedVideo) {
        return null;
    }

    return (
        <div>
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
        </div>
    );
});
