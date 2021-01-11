import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { Track } from '../interfaces'

type Props = {
  selectedTrackId: string
  selectTrack: Function
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

const TrackSelector = ({ selectedTrackId, selectTrack }: Props) => {
  const classes = useStyles()
  const tracks: Track = {
    1: 'Track 1',
    2: 'Track 2',
    3: 'Track 3',
    4: 'Track 4',
    5: 'Track 5',
    6: 'Track 6',
  }

  return (
    <ToggleButtonGroup
      className={classes.buttongroup}
      value={selectedTrackId}
      color="primary"
      onChange={(_evnet, value) => selectTrack(event, value)}
      exclusive
      aria-label="text primary button group"
    >
      {Object.keys(tracks).map((key) => (
        <ToggleButton value={key} className={classes.debug}>
          {tracks[key]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default TrackSelector
