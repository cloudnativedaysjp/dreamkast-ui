import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export const BoothPageContainer = styled(Grid)`
  height: 100%;
`

export const LogoImg = styled.img`
  width: auto;
  max-width: 100%;
  max-height: 200px;
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

export const PdfContainer = styled.div`
  text-align: center;
`
