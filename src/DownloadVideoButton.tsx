import {FC} from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  display: inline-block;
  background-color: black;
  color: white;
  padding: 4px;
  font-family: sans-serif;
  font-size: 16px;
  cursor: pointer;
`;

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
        <Wrapper onClick={handleClick}>Download</Wrapper>
    );
};