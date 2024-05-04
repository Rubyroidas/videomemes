import {FC, PropsWithChildren} from 'react';

import {Button} from '../App.styles';
import {downloadBlob} from '../../utils';
import {AnalyticsEvent, sendAnalyticsEvent} from '../../services/analytics';

type Props = PropsWithChildren & {
    data: Blob;
    fileName: string;
}
export const DownloadVideoButton: FC<Props> = ({data, fileName, children}) => {
    const handleClick = () => {
        sendAnalyticsEvent(AnalyticsEvent.DownloadButtonClicked);
        downloadBlob(data, fileName);
    };
    
    return (
        <Button onClick={handleClick}>
            {children}
        </Button>
    );
};
