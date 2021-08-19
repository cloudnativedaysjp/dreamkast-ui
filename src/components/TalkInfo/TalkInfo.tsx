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
      'http://twitter.com/share?url=https://event.cloudnativedays.jp/cicd2021&related=@cloudnativedays&hashtags=cicd2021'
    if (!trackName) return base
    return base + '_' + trackName
  }

  return (
    <Styled.OuterContainer>
      <Styled.Container>
        <Styled.Title>{selectedTalk?.title}</Styled.Title>
        <Styled.SpeakerContainer>
          <Styled.Speaker>
            {selectedTalk?.speakers
              .map((speaker) => {
                return speaker.name
              })
              .join(' / ')}
          </Styled.Speaker>
          <div style={{ paddingRight: '20px' }} />
          {selectedTalk?.documentUrl && (
            <Styled.DocsLink href={selectedTalk?.documentUrl} target="_blank">
              登壇資料はこちら
            </Styled.DocsLink>
          )}
        </Styled.SpeakerContainer>
        <Styled.Content>{selectedTalk?.abstract}</Styled.Content>
        <Styled.SocialHeader>
          <Styled.TalkIcon src="/cicd2021/ui/images/talk_icon.png" />
          一緒に盛り上がろう
        </Styled.SocialHeader>
        <Styled.ButtonContainer>
          <Styled.ButtonLink href="https://cnd.ovice.in/" target="_blank">
            <Styled.OViceButton>
              Ask the speaker
            </Styled.OViceButton>
          </Styled.ButtonLink>
          <div style={{ paddingRight: '8px' }} />
          <Styled.ButtonLink
            href={twitterURL(selectedTrackName)}
            target="_blank"
          >
            <Styled.TweetButton>
              <Styled.TwitterImg src="/cicd2021/ui/images/twitter_logo.png" />
              tweet #cicd2021_{selectedTrackName}
            </Styled.TweetButton>
          </Styled.ButtonLink>
        </Styled.ButtonContainer>
      </Styled.Container>
    </Styled.OuterContainer>
  )
}
