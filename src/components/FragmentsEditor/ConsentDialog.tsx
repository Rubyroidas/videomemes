import {useEffect, useRef} from 'react'
import styled from '@emotion/styled';
import {useTranslation} from 'react-i18next';

import {Button} from '../App.styles';

type ConsentDialogProps = {
    title: string;
    message: string;
    onClose: (result: boolean) => void;
}

const DialogWrapper = styled.dialog`
    width: 400px;
    padding: 20px;
    border: none;
    outline: none;
    position: fixed;
    z-index: 100;
    border-radius: 16px;
    
    &::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }
    @media (max-width: 480px) {
        width: 60vw;
        border-radius: 2vw;
        padding: 5vw;
    }
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 1.2em;
    margin: 0 0 20px;
    @media (max-width: 480px) {
        margin: 0 0 4vw;
    }
`;
const Message = styled.div`
    margin: 16px 0;
    @media (max-width: 480px) {
        margin: 4vw 0;
    }
`;

export const ConsentDialog = (props: ConsentDialogProps) => {
    const {t} = useTranslation();
    const {title, message, onClose} = props;
    const dlgRef = useRef<HTMLDialogElement>(null);

    const handleResult = (result: boolean) => {
        onClose(result);
    };

    useEffect(() => {
        dlgRef.current?.showModal();
    }, []);

    return (
        <DialogWrapper
            ref={dlgRef}
            open={false}
            onClose={() => handleResult(false)}
            aria-modal="true"
        >
            <div>
                <Title>{title}</Title>
                <Message>{message}</Message>
                <Button onClick={() => handleResult(true)}>{t('dialog.ok')}</Button>
                <Button onClick={() => handleResult(false)}>{t('dialog.cancel')}</Button>
            </div>
        </DialogWrapper>
    );
};
