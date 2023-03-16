import React, { useEffect } from 'react'
import { IvsPlayer } from '../IvsPlayer'
import { Chat } from '../Chat'
import Grid from '@material-ui/core/Grid'
import { TalkSelector } from '../TalkSelector'
import { TalkInfo } from '../TalkInfo'
import { Sponsors } from '../Sponsors'
import 'dayjs/locale/ja'
import { Event, Talk } from '../../generated/dreamkast-api.generated'
import { useDispatch, useSelector } from 'react-redux'
import {
  useSelectedTalk,
  useSelectedTrack,
  settingsInitializedSelector,
  settingsSelector,
  setViewTalkId,
  videoCommandSelector,
  isLiveModeSelector,
  setIsLiveMode,
} from '../../store/settings'
import {
  useKarteTracking,
  useLiveTalkUpdate,
  useSizeChecker,
  useTrailMapTracking,
} from '../TrackSelector/hooks'
import { useRunAfter } from '../hooks/useRunAfter'

type Props = {
  event: Event
  propTalks?: Talk[]

  refetch: () => void
}

export const TrackView: React.FC<Props> = ({ event, refetch }) => {
  const dispatch = useDispatch()
  const { track: selectedTrack, talks } = useSelectedTrack()
  const { talk: selectedTalk } = useSelectedTalk()
  const { run: lazyRefetch } = useRunAfter(
    refetch,
    // 1つ目のtalkの切り替わりが発生してから、270s~330s経過してからtrackとtalkをまとめて最新化する。
    // - live talkの切り替わりはactioncableのeventで行われるが、time offsetの更新などは反映されないため、talkとtrackを取り直すことで最新化する
    // - 各trackのlive talk更新タイミングにばらつきがあるため、5分程度待ち全てのtrackのlive talkの更新が完了してからfetchする
    // - 全クライアントが一斉にrequestするのを避けるために、ランダムオフセットを与えてタイミングをばらつかせる
    (270 + 60 * Math.random()) * 1000,
  )

  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const videoId = useSelector(videoCommandSelector)
  const isLiveMode = useSelector(isLiveModeSelector)

  useKarteTracking()
  useTrailMapTracking()
  useLiveTalkUpdate(event.abbr, () => {
    lazyRefetch()
  })
  const isSmallerThanMd = useSizeChecker()

  useEffect(() => {
    if (isLiveMode && talks.length > 0) {
      refetch()
    }
  }, [isLiveMode])

  const changeLiveMode = (checked: boolean) => {
    dispatch(setIsLiveMode(checked))
  }

  const selectTalk = (talkId: number) => {
    dispatch(setViewTalkId(talkId))
  }

  if (!initialized) {
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
            showVideoToggle={
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
            eventAbbr={event.abbr}
            selectedTalk={selectedTalk}
            selectedTrack={selectedTrack}
            showVideoToggle={settings.profile.isAttendOffline}
          />
        </Grid>
        <Grid item xs={12} md={4} style={{ height: '100%' }}>
          <TalkSelector
            selectedTalkId={selectedTalk?.id}
            selectedTrackId={selectedTrack?.id}
            talks={talks}
            isLiveMode={isLiveMode}
            changeLiveMode={changeLiveMode}
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
            eventAbbr={event.abbr}
            selectedTalk={selectedTalk}
            selectedTrack={selectedTrack}
            showVideoToggle={settings.profile.isAttendOffline}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Chat event={event} talk={selectedTalk} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TalkSelector
            selectedTalkId={selectedTalk?.id}
            selectedTrackId={selectedTrack?.id}
            talks={talks}
            isLiveMode={isLiveMode}
            changeLiveMode={changeLiveMode}
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
