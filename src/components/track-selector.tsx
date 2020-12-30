import * as React from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

type Props = {
  tracks: String[]
}

const TrackSelector = ({ tracks }: Props) => (
  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
    {tracks.map((track) => (
      <Button>{track}</Button>
    ))}
  </ButtonGroup>
)

export default TrackSelector
