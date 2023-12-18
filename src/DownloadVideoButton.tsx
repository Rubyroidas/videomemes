import {FC} from "react";

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
        <div onClick={handleClick}>Download</div>
    );
};