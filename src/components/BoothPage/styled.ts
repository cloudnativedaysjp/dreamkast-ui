import styled from 'styled-components'
import { Container as MuiContainer } from '@material-ui/core'

export const BoothPageContainer = styled.div`
  height: 100%;
  margin: 1.5em !important;
`

export const Container = styled(MuiContainer)`
  height: 100%;
  margin-top: 1.5em !important;
  margin-bottom: 1.5em !important;
  background: rgba(255, 255, 255, 0.7);
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

export const CenterContainer = styled.div`
  text-align: center;
`

export const HeaderContainer = styled.div`
  text-align: center;
`
export const VimeoContainer = styled.div`
  text-align: center;
`

export const KeyImage = styled.img`
  max-width: 20%;
  margin: auto;
`

export const MiroIframe = styled.iframe`
  width: 90%;
  min-height: 400px;
`

export const PdfContainer = styled.div`
  text-align: center;
`
