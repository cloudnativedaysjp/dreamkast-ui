import React, { useEffect, useState, useCallback, useRef } from 'react'
import { IvsPlayer } from '../IvsPlayer'
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
import ActionCable from 'actioncable'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'

type Props = {
  event: Event
  profile?: Profile
  selectedTrack: Track | null
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
  const [showCountdown, setShowCountdown] = useState<boolean>(false)
  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)
  const [nextTalk, setNextTalk] = useState<{ [trackId: number]: Talk }>()
  const beforeTrackId = useRef<number | undefined>(selectedTrack?.id)

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

  const getTalks = useCallback(async () => {
    const api = new TalkApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const dayId = findDayId()
    if (!dayId) return
    const { data } = await api.apiV1TalksGet(
      !!event ? event?.abbr : '',
      String(selectedTrack?.id),
      dayId,
    )
    setTalks(data)
  }, [event, selectedTrack])

  useEffect(() => {
    if (!propTalks) getTalks()
  }, [getTalks])

  useEffect(() => {
    if (isLiveMode) getTalks()
  }, [isLiveMode])

  const selectTalk = (talk: Talk) => {
    if (!talk.onAir) {
      setIsLiveMode(false)
    }
    setSelectedTalk(talk)
    setVideoId(talk.onAir ? selectedTrack?.videoId : talk.videoId)
  }

  useEffect(() => {
    if (
      !talks.length ||
      showCountdown ||
      (!isLiveMode && beforeTrackId.current === selectedTrack?.id)
    )
      return
    beforeTrackId.current = selectedTrack?.id
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

  const getNextTalk = () => {
    if (selectedTrack && nextTalk) return nextTalk[selectedTrack.id]
  }

  const onChecked = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setIsLiveMode(checked)
  }

  const updateView = () => {
    setShowCountdown(false)
    if (
      !nextTalk ||
      !selectedTrack ||
      !nextTalk[selectedTrack.id] ||
      !selectedTalk
    )
      return
    if (
      selectedTrack.id == nextTalk[selectedTrack.id].trackId &&
      selectedTalk.id != nextTalk[selectedTrack.id].id
    ) {
      window.location.href =
        window.location.href.split('#')[0] + '#' + selectedTalk.id // Karteの仕様でページ内リンクを更新しないと同一PV扱いになりアンケートが出ない
      window.tracker.track('trigger_survey', {
        track_name: selectedTrack?.name,
        talk_id: selectedTalk?.id,
        talk_name: selectedTalk?.title,
      })
      setVideoId(nextTalk[selectedTrack.id].videoId)
      setSelectedTalk(getNextTalk())
    }
  }

  const stopUpdate = () => {
    setShowCountdown(false)
    setIsLiveMode(false)
  }

  useEffect(() => {
    if (chatCable) chatCable.disconnect()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    const wsUrl = actionCableUrl()
    const cable = actionCable.createConsumer(wsUrl)
    setChatCable(cable)
    cable.subscriptions.create(
      { channel: 'OnAirChannel', eventAbbr: event?.abbr },
      {
        received: (msg: { [trackId: number]: Talk }) => {
          getTalks() // onAirの切り替わった新しいTalk一覧を取得
          setNextTalk(msg)
          if (!selectedTrack || !selectedTalk) return
          if (isLiveMode && msg[selectedTrack.id].id != selectedTalk.id)
            setShowCountdown(true)
        },
      },
    )
  }, [selectedTrack, isLiveMode, selectedTalk])

  useEffect(() => {
    clearInterval(timer)
    setTimer(
      window.setInterval(() => {
        window.tracker.track('watch_video', {
          track_name: selectedTrack?.name,
          talk_id: selectedTalk?.id,
          talk_name: selectedTalk?.title,
        })
      }, 120 * 1000),
    )
  }, [selectedTrack, selectedTalk])

  return (
    <Grid container spacing={0} justifyContent="center" alignItems="flex-start">
      <Grid item xs={12} md={8}>
        <IvsPlayer
          playBackUrl={videoId}
          nextTalk={getNextTalk()}
          autoplay={true}
          showCountdown={showCountdown}
          updateView={updateView}
          stopUpdate={stopUpdate}
        ></IvsPlayer>
        <Sponsors event={event} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Chat event={event} profile={profile} talk={selectedTalk} />
      </Grid>
      <Grid item xs={12} md={8} style={{ height: '100%' }}>
        <TalkInfo
          event={event}
          selectedTalk={selectedTalk}
          selectedTrackName={selectedTrack?.name}
          selectedTrackId={selectedTrack?.id}
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
    </Grid>
  )
}
