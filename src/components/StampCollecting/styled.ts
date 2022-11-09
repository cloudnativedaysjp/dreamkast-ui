import styled, { keyframes } from 'styled-components'

export const Container = styled.div`
  width: 90%;
  max-width: 600px;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
`

export const TrailMapImg = styled.img`
  width: 100%;
`

export const StampFrame = styled.div<{ top: string; left: string }>`
  background-color: rgba(239, 235, 233, 0.9);
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: 15%;
  height: 10%;
  padding: 0.5%;
  position: absolute;
`

const sample_anime02 = keyframes`
  0% {
    visibility: visible;
    opacity: 0;
    transform: rotate(-30deg) scale(2.5);
  }
  100% {
    visibility: visible;
    opacity: 0.8;
    transform: rotate(10deg) scale(1.00);
  }
`

export const Stamp = styled.img`
  width: 100%;
  height: 100%;
  display: inline-block;
  color: #c00;
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  border: 1px solid #c00;
  border-radius: 50%;
  padding: 10%;
  /* スタンプアニメーションのための初期値 */
  visibility: hidden;
  animation: ${sample_anime02} 1s paused both;

  animation-play-state: running;
`
