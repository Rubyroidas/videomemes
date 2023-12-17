import {FC} from "react";
import styled from '@emotion/styled';

type Props = {
    value: number
}
const Wrapper = styled.div`
  width: 200px;
  height: 40px;
  background-color: #b0b4fc;
  border: solid 1px blue;
  position: relative;
  color: #000;
  font-family: sans-serif;
  font-size: 24px;
`;
const Background = styled.div<Props>`
  width: ${p => Math.floor(100 * p.value)}%;
  height: 100%;
  background-color: #9398f5;
  position: absolute;
`;
const Foreground = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const ProgressBar: FC<Props> = ({value}) => (
    <Wrapper>
        <Background value={value}/>
        <Foreground>
            {(value * 100).toFixed(2)}%
        </Foreground>
    </Wrapper>
);
