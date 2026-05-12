import React, { useEffect } from 'react'
import * as Styled from './styled'
import { Talk, Track } from '../../generated/dreamkast-api.generated'
import { VideoToggleButton } from '../common/VideoToggleButton'
import { useViewerCount } from '../hooks/useViewerCount'

type Props = {
  eventAbbr: string
  profileId?: number
  selectedTalk?: Talk
  selectedTrack?: Track
  showVideoToggle?: boolean
}

export const TalkInfo: React.FC<Props> = ({
  profileId,
  eventAbbr,
  selectedTalk,
  selectedTrack,
  showVideoToggle,
}) => {
  const [viewerCount, timer] = useViewerCount(
    eventAbbr,
    profileId,
    selectedTrack?.name,
    selectedTalk?.id,
  )
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [timer])

  return (
    <Styled.Container>
      {selectedTalk?.onAir && <Styled.Live>LIVE 👥 {viewerCount}</Styled.Live>}
      {showVideoToggle && <VideoToggleButton />}
      <PTalkInfo
        eventAbbr={eventAbbr}
        selectedTalk={selectedTalk}
        selectedTrack={selectedTrack}
        showVideoToggle={showVideoToggle}
      />
    </Styled.Container>
  )
}

export const PTalkInfo: React.FC<Props> = ({
  eventAbbr,
  selectedTalk,
  selectedTrack,
}) => {
  const hashtag = eventAbbr === 'cnk' ? 'cloudnativekaigi' : eventAbbr
  const xURL = (trackName?: string) => {
    const base = `http://x.com/share?url=https://event.cloudnativedays.jp/${eventAbbr}&related=@cloudnativedays&hashtags=${hashtag}`
    if (!trackName) return base
    return base + '_' + trackName
  }

  return (
    <>
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
        <Styled.TalkIcon src={`/${eventAbbr}/ui/talk_icon.png`} />
        一緒に盛り上がろう
      </Styled.SocialHeader>
      <Styled.ButtonContainer>
        <Styled.ButtonLink href={xURL(selectedTrack?.name)} target="_blank">
          <Styled.XPostButton>
            <Styled.XImg src={`/${eventAbbr}/ui/x_logo.png`} />
            {`ポスト #${hashtag}_${selectedTrack?.name}`}
          </Styled.XPostButton>
        </Styled.ButtonLink>
      </Styled.ButtonContainer>
    </>
  )
}
