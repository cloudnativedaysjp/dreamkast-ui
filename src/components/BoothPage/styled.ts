import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export const BoothPageContainer = styled(Grid)`
  height: 100%;
`

export const Container = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  font-size: 1.2em;
  border-radius: 10px;
  margin: 5px;
  padding: 10px;
`

export const CenterContainer = styled.div`
  width: 100%;
  text-align: center;
`

export const LogoImg = styled.img`
  width: auto;
  max-width: 100%;
  max-height: 200px;
`

export const HeaderContainer = styled.div`
  text-align: center;
`

export const VimeoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 60%;
`

export const VimeoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const KeyImage = styled.img`
  max-width: 20%;
  margin: auto;
`

export const MiroIframe = styled.iframe`
  width: 100%;
  min-height: 500px;
`

export const PdfContainer = styled.div`
  text-align: center;
`

export const HeaderTitle = styled.h2`
  color: #037f8c;
`
