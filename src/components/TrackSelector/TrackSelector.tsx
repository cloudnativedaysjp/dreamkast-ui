import React, { useState, useEffect } from 'react'
import * as Styled from './styled'
import { setViewTrackIdToSessionStorage } from '../../util/viewTrackId'
import { Track } from '../../generated/dreamkast-api.generated'
import { FormatListBulleted } from '@material-ui/icons'
import { LiveTalkModalButton } from './styled'
import { LiveTrackList } from './LiveTrackList'
import { useTracksWithLiveTalk } from './hooks'
import { Theme, Tooltip } from '@material-ui/core'
import dayjs from 'dayjs'
import { withStyles } from '@material-ui/styles'

type Props = {
  tracks: Track[]
  selectedTrack: Track | null
  selectTrack: (track: Track) => void
}

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip)

export const TrackSelector: React.FC<Props> = ({
  tracks,
  selectedTrack,
  selectTrack,
}) => {
  const data = useTracksWithLiveTalk(tracks)

  const [item, setItem] = useState<number>(0)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (selectedTrack) setItem(selectedTrack.id)
  }, [selectedTrack])

  const handleChange = (
    _event: React.MouseEvent<HTMLElement> | null,
    selectItem: number | null,
  ) => {
    if (selectItem) {
      setViewTrackIdToSessionStorage(selectItem)
    }

    if (selectItem !== null) {
      const selectedTrack = tracks.find(
        (track) => track.id === selectItem,
      ) as Track
      setItem(selectedTrack.id)
      selectTrack(selectedTrack)
      window.location.href =
        window.location.href.split('#')[0] + '#' + selectedTrack.name
    }
  }

  return (
    <>
      <Styled.TrackMenuContainer
        value={item}
        color="primary"
        onChange={handleChange}
        exclusive
      >
        {data.map(({ track, talk }) => (
          <HtmlTooltip
            title={
              <React.Fragment>
                <div>
                  {!talk ? (
                    'ライブセッションはありません'
                  ) : (
                    <>
                      {talk.onAir && <Styled.Live>LIVE</Styled.Live>}{' '}
                      {dayjs(talk.startTime).format('HH:mm')}-
                      {dayjs(talk.endTime).format('HH:mm')}
                      <br />
                      {talk.title}
                      <br />
                      {talk.speakers?.map((s) => s.name).join(', ')}
                    </>
                  )}
                </div>
              </React.Fragment>
            }
          >
            <Styled.MenuItem key={track.id} value={track.id}>
              {track.name}
            </Styled.MenuItem>
          </HtmlTooltip>
        ))}
        <div>
          <LiveTalkModalButton
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            <FormatListBulleted />
          </LiveTalkModalButton>
        </div>
      </Styled.TrackMenuContainer>
      <Styled.LiveTalkModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <LiveTrackList
          selectedTrack={item}
          tracks={tracks}
          onChange={(i) => {
            setModalOpen(false)
            handleChange(null, i)
          }}
        />
      </Styled.LiveTalkModal>
    </>
  )
}
