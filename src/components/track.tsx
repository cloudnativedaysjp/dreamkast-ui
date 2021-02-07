import React from 'react'
import Player from './Player'
import TalkInfo from './TalkInfo'
import Chat from './Chat'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Talk } from '../interfaces'
import TalkSelector from './TalkSelector'

type Props = {
  selectedTrackId: string
  selectedTalk: Talk
  talks: Talk[]
  selectTalk: (talk: Talk) => void
}

const useStyles = makeStyles({
  player: {
    //backgroundColor: "#CC0",
  },
  chat: {
    //backgroundColor: "#CC0",
  },
})

const currentVimeoId = (selectedTalk: Talk, talks: Talk[]) => {
  let currentId = ''
  talks.forEach((talk) => {
    if (talk.id == selectedTalk.id) {
      currentId = talk.vimeoId
    }
  })
  return currentId
}

const Track: React.FC<Props> = ({
  selectedTalk,
  selectedTrackId,
  talks,
  selectTalk,
}) => {
  const classes = useStyles()

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="center"
      alignContent="center"
    >
      <Grid
        item
        xs={12}
        md={8}
        className={classes.player}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Player
          vimeoId={currentVimeoId(selectedTalk, talks)}
          autoplay={false}
        ></Player>
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        className={classes.chat}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Chat talk={selectedTalk} />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        className={classes.player}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <TalkInfo selectedTalk={selectedTalk} />
      </Grid>
      <Grid item xs={12} md={3} className={classes.chat}>
        <h2>このトラックのセッション</h2>
        <TalkSelector
          selectedTalk={selectedTalk}
          selectedTrackId={selectedTrackId}
          talks={talks}
          selectTalk={selectTalk}
        />
      </Grid>
    </Grid>
  )
}

export default Track
