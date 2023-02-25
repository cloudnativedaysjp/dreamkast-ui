import React, { useState, useEffect } from 'react'
import * as Styled from './styled'
import { setViewTrackIdToSessionStorage } from '../../util/viewTrackId'
import { Track } from '../../generated/dreamkast-api.generated'
import { PLiveTalkList } from './PLiveTalkList'
import { useTracksWithLiveTalk } from './hooks'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import { PTrackSelectorButtonGroup } from './PTrackSelectorButtonGroup'
import { LiveTalkModalButton } from './LiveTalkModalButton'

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
        <LiveTalkModalButton
          content={(closeModal) => (
            <PLiveTalkList
              data={data}
              selectedTrack={item}
              onChange={(i) => {
                closeModal()
                handleChange(i)
              }}
            />
          )}
        ></LiveTalkModalButton>
      </Styled.TrackMenuContainer>
    </>
  )
}
