import {FC, PropsWithChildren} from 'react';

import {Button} from '../App.styles';
import {downloadBlob} from '../../utils.ts';

type Props = PropsWithChildren & {
    data: Blob;
}
export const DownloadVideoButton: FC<Props> = ({data, children}) => {
    const handleClick = () => downloadBlob(data, 'video.mp4');
    
    return (
        <Button onClick={handleClick}>
            {children}
        </Button>
    );
};
