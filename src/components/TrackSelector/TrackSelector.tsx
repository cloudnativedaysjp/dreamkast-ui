import React, { useState, useEffect } from 'react'
import * as Styled from './styled'
import { setViewTrackIdToSessionStorage } from '../../util/viewTrackId'
import { Track } from '../../generated/dreamkast-api.generated'
import { FormatListBulleted } from '@material-ui/icons'
import { LiveTalkModalButton } from './styled'
import { PLiveTrackList } from './PLiveTrackList'
import { useTracksWithLiveTalk } from './hooks'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import { PTrackSelectorButtonGroup } from './PTrackSelectorButtonGroup'

type Props = {
  selectedTrack: Track | null
  selectTrack: (track: Track) => void
}

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
        <PTrackSelectorButtonGroup
          data={data}
          selectedTrack={item}
          onChange={handleChange}
        ></PTrackSelectorButtonGroup>
        <LiveTalkModalButton color="primary" onClick={() => setModalOpen(true)}>
          <FormatListBulleted />
        </LiveTalkModalButton>
      </Styled.TrackMenuContainer>

      <Styled.LiveTalkModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <PLiveTrackList
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
