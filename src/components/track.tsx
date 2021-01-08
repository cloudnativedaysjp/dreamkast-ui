import React from 'react'
import Player from '../components/player'
import TalkInfo from '../components/talk-info'
import Chat from './chat'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';
import { Talk } from '../interfaces'
import TalkSelector from './talk-selector'

type Props = {
  selectedTrackId: string
  selectedTalk: Talk
  talks: Talk[]
  selectTalk: Function
}

const useStyles = makeStyles({
  player: {
    //backgroundColor: "#CC0",
  },
  chat: {
    //backgroundColor: "#CC0",
  }
});

const currentVimeoId = (selectedTalk: Talk, talks: Talk[]) => {
  var currentId = ""
  talks.forEach(talk => {
    if (talk.id == selectedTalk.id) {
      currentId = talk.vimeoId;
    }
  });
  return currentId;
}

const Track = ({ selectedTalk, selectedTrackId, talks, selectTalk }: Props) => {
  const classes = useStyles();

  return (
    <Grid container spacing={1} justify="center" alignItems="center" alignContent="center">
      <Grid item xs={12} md={8} className={classes.player} justify="center" alignItems="center" alignContent="center">
        <Player vimeoId={currentVimeoId(selectedTalk, talks)} autoplay={false}></Player>
      </Grid>
      <Grid item xs={12} md={3} className={classes.chat} justify="center" alignItems="center" alignContent="center">
        <Chat talk={selectedTalk} />
      </Grid>
      <Grid item xs={12} md={8} className={classes.player} justify="center" alignItems="center" alignContent="center">
        <TalkInfo selectedTalk={selectedTalk} />
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        className={classes.chat}>
          <h2>このトラックのセッション</h2>
          <TalkSelector
            selectedTalk={selectedTalk}
            selectedTrackId={selectedTrackId}
            talks={talks}
            selectTalk={selectTalk} />
      </Grid>
    </Grid>
  )
}

export default Track;
