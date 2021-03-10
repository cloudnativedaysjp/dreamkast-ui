import React, { useEffect, useState } from 'react'
import { Player } from '../Player'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import {
  Track,
  Talk,
  TalkApi,
  Configuration,
  Profile,
  Event,
} from '../../client-axios'
import { TalkSelector } from '../TalkSelector'
import { TalkInfo } from '../TalkInfo'
import { Sponsors } from '../Sponsors'
import { Booths } from '../Booths'
import ActionCable from 'actioncable'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

type Props = {
  event?: Event
  profile?: Profile
  selectedTrack?: Track
  propTalks?: Talk[]
}

export const TrackView: React.FC<Props> = ({
  event,
  profile,
  selectedTrack,
  propTalks,
}) => {
  const [talks, setTalks] = useState<Talk[]>(propTalks ? propTalks : [])
  const [videoId, setVideoId] = useState<string>()
  const [selectedTalk, setSelectedTalk] = useState<Talk>()
  const [timer, setTimer] = useState<number>()
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true)

  const findDayId = () => {
    const today = dayjs(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DD')
    let dayId = ''
    event?.conferenceDays?.forEach((day) => {
      if (day.date == today && day.id) {
        dayId = String(day.id)
      }
    })
    return dayId
  }

  const getTalks = async () => {
    const api = new TalkApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await api.apiV1TalksGet(
      'cndo2021',
      String(selectedTrack?.id),
      findDayId(),
    )
    setTalks(data)
  }

  useEffect(() => {
    if (!propTalks) getTalks()
  }, [selectedTrack?.id])

  const selectTalk = (talk: Talk) => {
    if (!talk.onAir) {
      setIsLiveMode(false)
    }
    setSelectedTalk(talk)
    setVideoId(talk.onAir ? selectedTrack?.videoId : talk.videoId)
  }

  useEffect(() => {
    if (!talks.length || !isLiveMode) return
    const onAirTalk = talks.find((talk) => talk.onAir)
    setSelectedTalk(onAirTalk ? onAirTalk : talks[0])
    setVideoId(onAirTalk ? selectedTrack?.videoId : talks[0].videoId)
  }, [talks])

  const actionCableUrl = () => {
    if (window.location.protocol == 'http:') {
      return `ws://${window.location.host}/cable`
    } else {
      return `wss://${window.location.host}/cable`
    }
  }

  const onChecked = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setIsLiveMode(checked)
  }

  useEffect(() => {
    if (!selectedTrack) return
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
          if (!msg[selectedTrack.id] || !selectedTalk) return
          if (
            selectedTrack.id == msg[selectedTrack.id].trackId &&
            selectedTalk.id != msg[selectedTrack.id].id
          ) {
            getTalks() // onAirの切り替わった新しいTalk一覧を取得
          }
        },
      },
    )
  }, [selectedTrack])

  useEffect(() => {
    clearInterval(timer)
    setTimer(
      window.setInterval(() => {
        // console.log('sending logs...')
        // console.log(selectedTrack?.name)
        // console.log(selectedTalk?.title)
        window.tracker.track('watch_video', {
          track_name: selectedTrack?.name,
          talk_id: selectedTalk?.id,
          talk_name: selectedTalk?.title,
        })
      }, 120 * 1000),
    )
  }, [selectedTrack, selectedTalk])

  return (
    <Grid container spacing={0} justify="center" alignItems="flex-start">
      <Grid item xs={12} md={8}>
        <Player vimeoId={videoId} autoplay={true}></Player>
        <Sponsors />
      </Grid>
      <Grid item xs={12} md={4}>
        <Chat profile={profile} talk={selectedTalk} />
      </Grid>
      <Grid item xs={12} md={8} style={{ height: '100%' }}>
        <TalkInfo
          selectedTalk={selectedTalk}
          selectedTrackName={selectedTrack?.name}
        />
      </Grid>
      <Grid item xs={12} md={4} style={{ height: '100%' }}>
        <TalkSelector
          selectedTalk={selectedTalk}
          selectedTrackId={selectedTrack?.id}
          talks={talks}
          isLiveMode={isLiveMode}
          changeLiveMode={onChecked}
          selectTalk={selectTalk}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Booths openNewWindow={true} />
      </Grid>
    </Grid>
  )
}
