import styled, { keyframes } from 'styled-components'
import { Button, Modal } from '@material-ui/core'

export const TrailMapModal = styled(Modal)`
  width: 100vw;
`

export const Container = styled.div`
  width: 90%;
  height: calc(100vh - 100px);
  max-width: 600px;
  top: 50px;
  left: 50%;
  position: absolute;
  transform: translate(-50%, 0);
  overflow-y: scroll;
`

export const InnerContainer = styled.div`
  width: 100%;
  overflow-y: scroll;
`

export const TrailMapHeader = styled.img`
  width: 100%;
  height: 100%;
`

export const TrailMapPointSuspendContainer = styled.div`
  width: 100%;
  padding-top: 50%;
  height: 0;
  position: relative;
  margin-bottom: 5px;
  .suspend {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: whitesmoke;
    .skeleton {
      width: 100%;
      height: 100%;
    }
  }
`

export const TrailMapPointContainer = styled.div`
  position: relative;
  > img {
    width: 100%;
    border: 5px solid #ffffff;
    z-index: 10;
  }

  .point {
    top: 50%;
    left: 50%;
    font-size: min(6vw, 30px);
    font-weight: 900;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10%;
    z-index: 20;
    position: absolute;
    padding: 20px;
    transform: translate(-50%, -50%);
  }

  .ticket {
    top: 0;
    font-size: min(4vw, 16px);
    z-index: 20;
    position: absolute;
    font-weight: 500;
    color: #993527;
    margin-top: 10px;
    margin-left: 20px;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }
`

export const StampCardContainer = styled.div`
  width: 100%;
  padding-top: 40%;
  height: 0;
  position: relative;
  .suspend {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: white;
    .skeleton {
      width: 100%;
      height: 100%;
    }
  }
`

export const StampCard = styled.img`
  top: 0;
  width: 100%;
  position: absolute;
  border: 5px solid #ffffff;
  z-index: 10;
`

export const StampFrame = styled.div<{ top: string; left: string }>`
  background-color: rgba(239, 235, 233, 0.9);
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  width: 10%;
  padding-top: 10%;
  position: absolute;
  z-index: 20;
`

const stamping = keyframes`
  0% {
    visibility: visible;
    opacity: 0;
    transform: rotate(-30deg) scale(3);
  }
  70% {
    visibility: visible;
    opacity: 0.8;
    transform: rotate(10deg) scale(1.00);
  }
  100% {
    visibility: visible;
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
  transform: rotate(10deg) scale(1);
  top: 0;
  position: absolute;

  &.showAnimation {
    visibility: hidden;
    animation: ${stamping} 1.5s paused both;
    animation-play-state: running;
  }
`

const pulsing = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(150, 129, 180, 0.5);
  }
  60% {
    box-shadow: 0 0 0 1em transparent;
  }
`

export const TrailMapRule = styled.div`
  margin-top: 10px;
  padding: 5px;
  background-color: #efebe9;
  border: 5px solid #ffffff;

  > h3 {
    margin-block-start: 5px;
    margin-block-end: 5px;
    margin-left: 15px;
    border-left: 5px solid #3b203b;
    padding-left: 10px;
  }
  > ul {
    margin-block-start: 5px;
    margin-block-end: 5px;
  }
`

export const TrailMapButton = styled(Button)`
  &.pulse {
    -webkit-animation: ${pulsing} 2s infinite cubic-bezier(0.66, 0, 0, 1);
    -moz-animation: ${pulsing} 2s infinite cubic-bezier(0.66, 0, 0, 1);
    animation: ${pulsing} 4s infinite cubic-bezier(0.66, 0, 0, 1);
    box-shadow: 0 0 0 1em transparent;
  }
`
