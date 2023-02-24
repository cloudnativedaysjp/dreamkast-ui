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
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

type Props = {
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
  selectedTrack,
  selectTrack,
}) => {
  const { tracks } = useSelector(settingsSelector)
  const data = useTracksWithLiveTalk()

  const [item, setItem] = useState<number>(0)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (selectedTrack) setItem(selectedTrack.id)
  }, [selectedTrack])

  const handleChange = (selectItem: number | null) => {
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
      <Styled.TrackMenuContainer>
        <Styled.TrackSelectorButtonGroup
          value={item}
          color="primary"
          onChange={(_, i) => handleChange(i)}
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
        </Styled.TrackSelectorButtonGroup>
        <LiveTalkModalButton color="primary" onClick={() => setModalOpen(true)}>
          <FormatListBulleted />
        </LiveTalkModalButton>
      </Styled.TrackMenuContainer>
      <Styled.LiveTalkModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <LiveTrackList
          data={data}
          selectedTrack={item}
          onChange={(i) => {
            setModalOpen(false)
            handleChange(i)
          }}
        />
      </Styled.LiveTalkModal>
    </>
  )
}
