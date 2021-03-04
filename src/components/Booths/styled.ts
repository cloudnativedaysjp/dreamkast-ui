import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`
export const SponsorHeader = styled.h2`
  font-size: 2em;
  text-align: center;
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

export const SponsorGridItem = styled(Grid)`
  border-radius: 10px;
  position: relative;
  height: 80px;

  &:hover{
    background: rgba(255, 255, 255, 0.7);
  }
`

export const SponsorLink = styled.a`
  display: block;
  height: 100%;
  width: 100%;
`