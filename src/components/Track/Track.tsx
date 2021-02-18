import React, { useEffect, useState, useCallback } from 'react'
import { Player } from '../Player'
import { TalkInfo } from '../TalkInfo'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Talk, TalkApi } from '../../client-axios'
import { TalkSelector } from '../TalkSelector'

type Props = {
  selectedTrackId: number
  propTalks?: Talk[]
}

const useStyles = makeStyles({
  player: {
    //backgroundColor: "#CC0",
  },
  chat: {
    //backgroundColor: "#CC0",
  },
})

export const TrackView: React.FC<Props> = ({ selectedTrackId, propTalks }) => {
  const classes = useStyles()
  const [talks, setTalks] = useState<Talk[]>(propTalks ? propTalks : [])
  const [selectedTalk, setSelectedTalk] = useState<Talk>()

  const getTalks = useCallback(async () => {
    const api = new TalkApi()
    const { data } = await api.apiV1TalksGet(
      'cndo2021',
      String(selectedTrackId),
    )
    setTalks(data)
  }, [selectedTrackId])

  useEffect(() => {
    if (!propTalks) getTalks()
  }, [getTalks])

  const selectTalk = (talk: Talk) => {
    setSelectedTalk(talk)
  }

  useEffect(() => {
    const onAirTalk = talks.find((talk) => talk.onAir)
    setSelectedTalk(onAirTalk ? onAirTalk : talks[0])
  }, [talks])

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
        <Player vimeoId={selectedTalk?.videoId} autoplay={false}></Player>
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
