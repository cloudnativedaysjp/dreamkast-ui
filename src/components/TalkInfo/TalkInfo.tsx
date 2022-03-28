import React, { useEffect, useState, useCallback } from 'react'
import * as Styled from './styled'
import { Event, Talk, TrackApi, Configuration } from '../../client-axios'

type Props = {
  event?: Event
  selectedTalk?: Talk
  selectedTrackName?: string
  selectedTrackId?: number
}

export const TalkInfo: React.FC<Props> = ({
  event,
  selectedTalk,
  selectedTrackName,
  selectedTrackId,
}) => {
  const [timer, setTimer] = useState<number>()
  const [viewerCount, setViewerCount] = useState<string>()

  const twitterURL = (trackName?: string) => {
    const base = `http://twitter.com/share?url=https://event.cloudnativedays.jp/${event?.abbr}&related=@cloudnativedays&hashtags=${event?.abbr}`
    if (!trackName) return base
    return base + '_' + trackName
  }

  const getViewerCount = useCallback(async () => {
    console.log('Start getViewerCount')
    const api = new TrackApi(
      new Configuration({ basePath: window.location.origin }),
    )
    if (selectedTrackId) {
      try {
        console.log('Trying request')
        const { data } = await api.apiV1TracksTrackIdViewerCountGet(
          selectedTrackId.toString(),
        )
        setViewerCount(data.viewer_count.toString())
      } catch {
        setViewerCount('-')
      }
    }
  }, [viewerCount, selectedTrackId])

  useEffect(() => {
    getViewerCount()
    clearInterval(timer)
    setTimer(
      window.setInterval(() => {
        getViewerCount()
      }, 60 * 1000),
    )
  }, [selectedTrackId])

  return (
    <Styled.OuterContainer>
      <Styled.Container>
        {selectedTalk?.onAir && (
          <Styled.Live>LIVE 👥 {viewerCount}</Styled.Live>
        )}
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
          <Styled.TalkIcon src={`/${event?.abbr}/ui/images/talk_icon.png`} />
          一緒に盛り上がろう
        </Styled.SocialHeader>
        <Styled.ButtonContainer>
          <Styled.ButtonLink
            href={twitterURL(selectedTrackName)}
            target="_blank"
          >
            <Styled.TweetButton>
              <Styled.TwitterImg
                src={`/${event?.abbr}/ui/images/twitter_logo.png`}
              />
              {`tweet #${event?.abbr}_${selectedTrackName}`}
            </Styled.TweetButton>
          </Styled.ButtonLink>
        </Styled.ButtonContainer>
      </Styled.Container>
    </Styled.OuterContainer>
  )
}
