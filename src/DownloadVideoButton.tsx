import {FC} from 'react';

import {Button} from './App.styles';

type Props = {
    data: Blob;
}
export const DownloadVideoButton: FC<Props> = ({data}) => {
    const handleClick = () => {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        a.click();
        window.URL.revokeObjectURL(url);
    };
    
    return (
        <Button onClick={handleClick}>Download</Button>
    );
};
