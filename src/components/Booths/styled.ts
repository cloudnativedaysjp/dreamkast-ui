import styled from 'styled-components'

export const Container = styled.div`
  height: 390px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 10px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const Title = styled.h2`
  color: #037f8c;
`

export const Content = styled.div`
  padding: 10px 0;
`

export const SponsorImg = styled.img`
  max-width: 150px;
  max-height: 40px;
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
