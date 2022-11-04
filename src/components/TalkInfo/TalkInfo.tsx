import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { Event, Talk } from '../../generated/dreamkast-api.generated'
import { useGetApiV1TracksByTrackIdViewerCountQuery } from '../../generated/dreamkast-api.generated'
import { Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { setShowVideo, settingsSelector } from '../../store/settings'
import { Videocam, VideocamOff } from '@material-ui/icons'

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
  const dispatch = useDispatch()
  const [viewerCount, setViewerCount] = useState<string>()
  const settings = useSelector(settingsSelector)

  const { data, isError, isLoading, error } =
    useGetApiV1TracksByTrackIdViewerCountQuery(
      { trackId: `${selectedTrackId}` },
      { skip: !selectedTrackId, pollingInterval: 60 * 1000 },
    )
  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      // TODO error handling
      console.error(error)
      return
    }
    if (data) {
      setViewerCount(data.viewerCount.toString())
    } else {
      setViewerCount('-')
    }
  }, [data, isLoading, isError])

  const twitterURL = (trackName?: string) => {
    const base = `http://twitter.com/share?url=https://event.cloudnativedays.jp/${event?.abbr}&related=@cloudnativedays&hashtags=${event?.abbr}`
    if (!trackName) return base
    return base + '_' + trackName
  }

  return (
    <Styled.OuterContainer>
      <Styled.Container>
        {selectedTalk?.onAir && (
          <Styled.Live>LIVE 👥 {viewerCount}</Styled.Live>
        )}
        {settings.profile.isAttendOffline && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            disableElevation
            startIcon={settings.showVideo ? <VideocamOff /> : <Videocam />}
            onClick={() => dispatch(setShowVideo(!settings.showVideo))}
          >
            {settings.showVideo ? 'Stop Video' : 'Show Video'}
          </Button>
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
          <Styled.TalkIcon src={`/${event?.abbr}/ui/talk_icon.png`} />
          一緒に盛り上がろう
        </Styled.SocialHeader>
        <Styled.ButtonContainer>
          <Styled.ButtonLink
            href={twitterURL(selectedTrackName)}
            target="_blank"
          >
            <Styled.TweetButton>
              <Styled.TwitterImg src={`/${event?.abbr}/ui/twitter_logo.png`} />
              {`tweet #${event?.abbr}_${selectedTrackName}`}
            </Styled.TweetButton>
          </Styled.ButtonLink>
        </Styled.ButtonContainer>
      </Styled.Container>
    </Styled.OuterContainer>
  )
}
