import styled from 'styled-components'

export const IvsPlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 60%;
`

export const IvsPlayerVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 0;
`

export const OverLayContainer = styled.div`
  background-color: rgba(70, 70, 70);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 94%;
  z-index: 10;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 80%;
  max-width: 36em;
`

export const PlayerButton = styled.button`
  width: 6.2em;
  height: 1.8em;
  border: 2px solid lightgray;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0);
  color: white;
  font-size: 1.6em;
  cursor: pointer;
  &:hover {
    background-color: rgba(189, 195, 199, 0.5);
  }
`

export const TextContainer = styled.div`
  width: 80%;
  max-width: 36em;
  font-size: 1.3em;
  font-weight: bold;
`

export const NextTitle = styled.div`
  font-size: 1.4em;
  font-weight: bold;
`
