import React, { useState, useEffect } from 'react'
import * as Styled from './styled'
import { Track } from '../../client-axios'

type Props = {
  tracks: Track[]
  selectedTrackId: number
  selectTrack: (selectedId: number) => void
}

export const TrackSelector: React.FC<Props> = ({
  tracks,
  selectedTrackId,
  selectTrack,
}) => {
  const [item, setItem] = useState(selectedTrackId)

  useEffect(() => {
    setItem(selectedTrackId)
  }, [selectedTrackId])

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    selectItem: number | null,
  ) => {
    if (selectItem !== null) {
      setItem(selectItem)
      selectTrack(selectItem as number)
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
