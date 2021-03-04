import styled from 'styled-components'

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 10px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

export const OuterContainer = styled.div`
  padding: 0 5px 12px 5px;
`

export const Title = styled.h2`
  color: #037f8c;
  font-size: 1.8em;
`

export const Content = styled.div`
  padding: 10px 0;
  font-size: 1.1em;
`

export const ShareButton = styled.a`
  margin: 10px 0px;
  padding: 5px;
  display: block;
  border: none !important;
  
  text-decoration: none;
  color: #037f8c;
  &:visited{
    color: #037f8c;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`

export const SocialHeader = styled.h4`
  color: #333;
  font-size: 1.2em;
`

export const TalkIcon = styled.img`
  height: 1.6em;
  vertical-align: middle;
  margin-right: 5px;
`

export const SocialImg = styled.img`
  height: 1.8em;
  vertical-align: middle;
`

export const SocialText = styled.span`
  font-size: 1.4em;
  vertical-align: middle;
  margin-left: 10px;
`