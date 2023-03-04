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
  settingsVideoIdSelector,
  isLiveModeSelector,
  setIsLiveMode,
} from '../../store/settings'
import {
  useKarteTracking,
  useLiveTalkUpdate,
  useSizeChecker,
  useTrailMapTracking,
} from '../TrackSelector/hooks'

type Props = {
  event: Event
  propTalks?: Talk[]

  refetch: () => void
}

export const TrackView: React.FC<Props> = ({ event, refetch }) => {
  const dispatch = useDispatch()
  const { track: selectedTrack, talks } = useSelectedTrack()
  const { talk: selectedTalk } = useSelectedTalk()

  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const videoId = useSelector(settingsVideoIdSelector)
  const isLiveMode = useSelector(isLiveModeSelector)

  useKarteTracking()
  useTrailMapTracking()
  useLiveTalkUpdate(event.abbr, () => {
    refetch() // onAirの切り替わった新しいTalk一覧を取得
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
            eventAbbr={event.abbr}
            selectedTalk={selectedTalk}
            selectedTrack={selectedTrack}
            showVideoToggle={settings.profile.isAttendOffline}
          />
        </Grid>
        <Grid item xs={12} md={4} style={{ height: '100%' }}>
          <TalkSelector
            selectedTalk={selectedTalk}
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
            selectedTalk={selectedTalk}
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
