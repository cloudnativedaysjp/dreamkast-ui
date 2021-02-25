import React, { useEffect, useState, useCallback } from 'react'
import { Player } from '../Player'
import { TalkInfo } from '../TalkInfo'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import { Talk, TalkApi, Configuration } from '../../client-axios'
import { TalkSelector } from '../TalkSelector'
import { Sponsors } from '../Sponsors'
import ActionCable from 'actioncable'

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

  const actionCableUrl = () => {
    if (window.location.protocol == 'http:') {
      return `ws://${window.location.host}/cable`
    } else {
      return `wss://${window.location.host}/cable`
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    const wsUrl = actionCableUrl()
    const cableApp: ActionCable.Cable = actionCable.createConsumer(wsUrl)
    if (cableApp) {
      cableApp.disconnect()
    }
    cableApp.subscriptions.create(
      { channel: 'OnAirChannel', eventAbbr: 'cndo2021' },
      {
        received: (msg: { [trackId: number]: Talk }) => {
          if (!msg[selectedTrackId] && !selectedTalk) return
          if (selectedTalk?.id != msg[selectedTrackId].id) {
            setSelectedTalk(msg[selectedTrackId])
          }
        },
      },
    )
  }, [selectedTrackId])

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
