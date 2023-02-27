import React, { useEffect, useState, useRef, useMemo } from 'react'
import { IvsPlayer } from '../IvsPlayer'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import { TalkSelector } from '../TalkSelector'
import { TalkInfo } from '../TalkInfo'
import { Sponsors } from '../Sponsors'
import ActionCable from 'actioncable'
import 'dayjs/locale/ja'
import {
  Event,
  Talk,
  Track,
  useGetApiV1TalksQuery,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
} from '../../generated/dreamkast-api.generated'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { getSlotId } from '../../util/trailMap'

type Props = {
  event: Event
  selectedTrack: Track | null
  propTalks?: Talk[]

  refetch: () => void
}

export const TrackView: React.FC<Props> = ({
  event,
  selectedTrack,
  refetch: refetchAll,
}) => {
  const [talks, setTalks] = useState<Talk[]>([])
  const [videoId, setVideoId] = useState<string | null>()
  const [selectedTalk, setSelectedTalk] = useState<Talk>()
  const [karteTimer, setKarteTimer] = useState<number>()
  const [pointTimer, setPointTimer] = useState<number>()
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true)
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false)
  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)
  const [nextTalk, setNextTalk] = useState<{ [trackId: number]: Talk }>()
  const beforeTrackId = useRef<number | undefined>(selectedTrack?.id)
  const settings = useSelector(settingsSelector)
  const theme = useTheme()
  const isSmallerThanMd = !useMediaQuery(theme.breakpoints.up('md'))
  const [_, setError] = useState()

  const dayId = settings.conferenceDay?.id

  const onAirTalkExists = useMemo(() => {
    return talks.filter((talk) => !!talk.onAir).length > 0
  }, [talks])

  const { data, isLoading, isError, error, refetch } = useGetApiV1TalksQuery(
    {
      eventAbbr: event.abbr,
      trackId: `${selectedTrack?.id}`,
      conferenceDayIds: dayId,
    },
    { skip: !dayId || !selectedTrack?.id },
  )
  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      setError(() => {
        throw error
      })
      return
    }
    if (data) {
      setTalks(data)
    }
  }, [data, isLoading, isError])

  useEffect(() => {
    if (isLiveMode) {
      if (data) {
        refetch()
      }
    }
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
      shouldUpdate ||
      (!isLiveMode && beforeTrackId.current === selectedTrack?.id)
    )
      return
    beforeTrackId.current = selectedTrack?.id
    const onAirTalk = talks.find((talk) => talk.onAir)
    setSelectedTalk(onAirTalk ? onAirTalk : talks[0])
    if (!onAirTalkExists) {
      // NOTE just for testing
      setVideoId(selectedTrack?.videoId)
    } else {
      setVideoId(onAirTalk ? selectedTrack?.videoId : talks[0].videoId)
    }
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
    setShouldUpdate(false)
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

  useEffect(() => {
    if (shouldUpdate) {
      updateView()
    }
  }, [shouldUpdate])

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
          refetch() // onAirの切り替わった新しいTalk一覧を取得
          refetchAll()
          setNextTalk(msg)
          if (!selectedTrack || !selectedTalk) return
          if (isLiveMode && msg[selectedTrack.id].id != selectedTalk.id)
            setShouldUpdate(true)
        },
      },
    )
  }, [selectedTrack, isLiveMode, selectedTalk])

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()

  useEffect(() => {
    if (!settings.initialized) {
      return
    }
    if (!selectedTrack || !selectedTalk) {
      return
    }
    clearInterval(karteTimer)
    setKarteTimer(
      window.setInterval(() => {
        window.tracker.track('watch_video', {
          track_name: selectedTrack.name,
          talk_id: selectedTalk.id,
          talk_name: selectedTalk.title,
        })
      }, 120 * 1000),
    )
    clearTimeout(pointTimer)
    if (!settings.profile.isAttendOffline && selectedTalk.onAir) {
      setPointTimer(
        window.setInterval(() => {
          const slotId = getSlotId(selectedTalk)
          if (slotId === 0) {
            return
          }
          mutateAppData({
            profileId: `${settings.profile.id}`,
            conference: settings.eventAbbr,
            dkUiDataMutation: {
              action: 'talkWatched',
              payload: {
                talkId: selectedTalk.id,
                trackId: selectedTrack?.id || 0,
                slotId: slotId,
              },
            },
          })
            .unwrap()
            .catch((err) => console.error(err))
        }, 120 * 1000),
      )
    }
  }, [selectedTrack, selectedTalk, settings.initialized])

  if (!settings.initialized) {
    // TODO show loading
    return <></>
  }

  if (settings.showVideo) {
    return (
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={8}>
          <IvsPlayer
            playBackUrl={videoId}
            autoplay={true}
            showStopVideoButton={
              isSmallerThanMd && settings.profile.isAttendOffline
            }
          ></IvsPlayer>
          <Sponsors event={event} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chat event={event} talk={selectedTalk} />
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
            small
          />
        </Grid>
      </Grid>
    )
  } else {
    return (
      <Grid container spacing={1} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} md={4}>
          <TalkInfo
            event={event}
            selectedTalk={selectedTalk}
            selectedTrackName={selectedTrack?.name}
            selectedTrackId={selectedTrack?.id}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chat event={event} talk={selectedTalk} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TalkSelector
            selectedTalk={selectedTalk}
            selectedTrackId={selectedTrack?.id}
            talks={talks}
            isLiveMode={isLiveMode}
            changeLiveMode={onChecked}
            selectTalk={selectTalk}
          />
        </Grid>
        <Grid item md={12}>
          <Sponsors event={event} />
        </Grid>
      </Grid>
    )
  }
}
