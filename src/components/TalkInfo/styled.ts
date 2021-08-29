import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 10px;
`

export const OuterContainer = styled.div`
  padding: 0 5px 12px 5px;
`

export const Title = styled.h2`
  color: #423A57;
  font-size: 1.8em;
`

export const SpeakerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0;
`

export const Speaker = styled.div`
  font-size: 16px;
  font-weight: bold;
`

export const Content = styled.div`
  padding: 10px 0;
  height: 230px;
  font-size: 1.1em;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 0 0 5px 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(3, 127, 140, 0.8);
  }
`

export const DocsLink = styled.a`
  text-decoration: none;
  color: #423A57;
  font-weight: bold;
  font-size: 16px;
`

export const SocialHeader = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  font-size: 1.2em;
  padding: 10px 0;
  font-weight: bold;
`

export const TalkIcon = styled.img`
  height: 1.6em;
  vertical-align: middle;
  margin-right: 5px;
`

export const ButtonContainer = styled.div`
  display: flex;
`

export const ButtonLink = styled.a`
  text-decoration: none;
`

export const OViceButton = styled(Button)`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding-right: 10px;
  color: #ffffff;
  background-color: #7289da;
  &:hover {
    background-color: #9aabe4;
  }
`

export const OViceImg = styled.img`
  height: 1.7em;
  vertical-align: middle;
  padding-right: 5px;
`

export const TweetButton = styled(Button)`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding-right: 10px;
  color: #ffffff;
  background-color: #1da1f2;
  &:hover {
    background-color: #4cb7f4;
  }
`

export const TwitterImg = styled.img`
  height: 1.4em;
  padding: 1.5px;
  vertical-align: middle;
  padding-right: 5px;
`
