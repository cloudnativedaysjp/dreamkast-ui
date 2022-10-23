import React, { useState, useEffect } from 'react'
import * as Styled from './styled'
import { setViewTrackIdToSessionStorage } from '../../util/viewTrackId'
import { Track } from '../../generated/dreamkast-api.generated'

type Props = {
  tracks: Track[]
  selectedTrack: Track | null
  selectTrack: (track: Track) => void
}

export const TrackSelector: React.FC<Props> = ({
  tracks,
  selectedTrack,
  selectTrack,
}) => {
  const [item, setItem] = useState<number>(0)

  useEffect(() => {
    if (selectedTrack) setItem(selectedTrack.id)
  }, [selectedTrack])

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
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
    <Styled.TrackMenuContainer
      value={item}
      color="primary"
      onChange={handleChange}
      exclusive
    >
      {tracks.map((track) => (
        <Styled.MenuItem key={track.id} value={track.id}>
          {track.name}
        </Styled.MenuItem>
      ))}
    </Styled.TrackMenuContainer>
  )
}
