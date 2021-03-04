import React from 'react'
import * as Styled from './styled'
import { Talk } from '../../client-axios'

type Props = {
  selectedTalk?: Talk
  selectedTrackName?: string
}

export const TalkInfo: React.FC<Props> = ({
  selectedTalk,
  selectedTrackName,
}) => {
  const twitterURL = (trackName?: string) => {
    const base =
      'http://twitter.com/share?url=https://event.cloudnativedays.jp/cndo2021&related=@cloudnativedays&hashtags=CNDO2021'
    if (!trackName) return base
    return base + '_' + trackName
  }

  return (
    <Styled.OuterContainer>
      <Styled.Container>
        <Styled.Title>{selectedTalk?.title}</Styled.Title>
        <h3>
          {selectedTalk?.speakers
            .map((speaker) => {
              return speaker.name
            })
            .join(' / ')}
        </h3>
        <Styled.Content>{selectedTalk?.abstract}</Styled.Content>
        <Styled.SocialHeader><Styled.TalkIcon src="/cndo2021/ui/images/talk_icon.png" />一緒に盛り上がろう</Styled.SocialHeader>
        <Styled.ShareButton href="https://discord.gg/bvuTMNQ" target="_blank">
          <Styled.SocialImg src="/cndo2021/ui/images/discord.png" />
          <Styled.SocialText>Ask the speaker</Styled.SocialText>
        </Styled.ShareButton>
        <Styled.ShareButton
          href={twitterURL(selectedTrackName)}
          target="_blank"
        >
          <Styled.SocialImg src="/cndo2021/ui/images/twitter.png" />
          <Styled.SocialText>
            Twitterでつぶやく #CNDT2020_{selectedTrackName}
          </Styled.SocialText>
        </Styled.ShareButton>
      </Styled.Container>
    </Styled.OuterContainer>
  )
}
