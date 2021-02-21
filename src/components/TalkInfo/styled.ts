import styled from 'styled-components'

export const Container = styled.div`
  height: 490px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 10px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const OuterContainer = styled.div`
  padding: 0 0 43px 0;
`

export const Title = styled.h2`
  color: #037f8c;
`

export const Content = styled.div`
  padding: 10px 0;
`
