import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export const Container = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  font-size: 1.2em;
  border-radius: 10px;
  margin: 5px;
  padding: 10px;
`

export const OuterContainer = styled(Grid)`
  height: 100%;
`

export const CenterizedContainer = styled.div`
  text-align: center;
`

export const Header2 = styled.h2<{ centerized?: boolean }>`
  color: #037f8c;
  ${({ centerized }) => (centerized ? 'text-align: center' : '')};
`

export const Header3 = styled.h3<{ centerized?: boolean }>`
  color: #037f8c;
  ${({ centerized }) => (centerized ? 'text-align: center' : '')};
`

export const MiroIframe = styled.iframe`
  width: 100%;
  min-height: 500px;
`

export const MenuLink = styled.a`
  text-decoration-line: none;
`

export const ButtonContainer = styled.div`
  padding-bottom: 10px;
`
