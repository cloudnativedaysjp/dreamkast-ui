import styled, { keyframes } from 'styled-components'
import { Button } from '@material-ui/core'

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
  min-width: 12%; // TODO
  height: 15%;
  padding: 0.5%;
  position: absolute;
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
  border: 1px solid #c00;
  border-radius: 50%;
  padding: 10%;
  transform: rotate(10deg) scale(1);

  &.showAnimation {
    visibility: hidden;
    animation: ${stamping} 1.5s paused both;
    animation-play-state: running;
  }
`

const pulsing = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(153, 53, 39, 0.5);
  }
  60% {
    box-shadow: 0 0 0 1em transparent;
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
