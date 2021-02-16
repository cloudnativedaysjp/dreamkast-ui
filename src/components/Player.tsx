import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'

type Props = {
  vimeoId?: string
  autoplay: boolean
}

const useStyles = makeStyles({
  player: {
    width: '100%',
    height: '500px',
    backgroundColor: '#123',
  },
})

const Player: React.FC<Props> = ({ vimeoId, autoplay }) => {
  const classes = useStyles()
  return (
    <iframe
      src={
        'https://player.vimeo.com/video/' +
        vimeoId +
        '?autoplay=' +
        Number(autoplay)
      }
      className={classes.player}
      frameBorder="0"
      allow="autoplay; fullscreen"
      //webkitallowfullscreen
      //mozallowfullscreen
      allowFullScreen
    ></iframe>
  )
}

export default Player
