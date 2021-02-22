import React, { useEffect, useState, useCallback } from 'react'
import { Player } from '../Player'
import { TalkInfo } from '../TalkInfo'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import { Talk, TalkApi, Configuration } from '../../client-axios'
import { TalkSelector } from '../TalkSelector'
import { Sponsors } from '../Sponsors'

type Props = {
  selectedTrackId: number
  propTalks?: Talk[]
}

export const TrackView: React.FC<Props> = ({ selectedTrackId, propTalks }) => {
  const [talks, setTalks] = useState<Talk[]>(propTalks ? propTalks : [])
  const [selectedTalk, setSelectedTalk] = useState<Talk>()

  const getTalks = useCallback(async () => {
    const api = new TalkApi(
      new Configuration({ basePath: window.location.origin }),
    )
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
    <Grid container spacing={1} justify="center" alignItems="flex-start">
      <Grid item xs={12} md={8}>
        <Player vimeoId={selectedTalk?.videoId} autoplay={false}></Player>
        <Sponsors />
      </Grid>
      <Grid item xs={12} md={3}>
        <Chat talk={selectedTalk} />
      </Grid>
      <Grid item xs={10} md={8}>
        <TalkInfo selectedTalk={selectedTalk} />
      </Grid>
      <Grid item xs={12} md={3}>
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
