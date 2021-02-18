import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { Track } from '../../client-axios'

type Props = {
  tracks: Track[]
  selectedTrackId: number
  selectTrack: (selectedId: number) => void
}

const useStyles = makeStyles({
  debug: {
    backgroundColor: '#CCC',
  },
  buttongroup: {
    justifyContent: 'center',
    backgroundColor: '#CC0',
  },
})

export const TrackSelector: React.FC<Props> = ({
  tracks,
  selectedTrackId,
  selectTrack,
}) => {
  const classes = useStyles()

  return (
    <ToggleButtonGroup
      className={classes.buttongroup}
      value={selectedTrackId}
      color="primary"
      onChange={(_event, value) => selectTrack(value as number)}
      exclusive
      aria-label="text primary button group"
    >
      {tracks.map((track) => (
        <ToggleButton key={track.id} value={track.id} className={classes.debug}>
          {track.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
