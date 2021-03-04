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
  color: black;
  &:visited{
    color: black;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`
export const SocialImg = styled.img`
  height: 2em;
  vertical-align: middle;
`

export const SocialText = styled.span`
  font-size: 1.5em;
  vertical-align: middle;
  margin-left: 10px;
`