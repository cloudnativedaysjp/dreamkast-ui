import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useSelectedTalk,
  useSelectedTrack,
  settingsInitializedSelector,
  settingsSelector,
  updateViewTalkWithLiveOne,
  isLiveModeSelector,
  patchTalksOnAir,
} from '../../store/settings'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { getSlotId } from '../../util/sessionstorage/trailMap'
import {
  Talk,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
} from '../../generated/dreamkast-api.generated'
import { authSelector } from '../../store/auth'

export const useKarteTracking = () => {
  const { track: selectedTrack } = useSelectedTrack()
  const { talk: selectedTalk } = useSelectedTalk()

  const initialized = useSelector(settingsInitializedSelector)
  const [karteTimer, setKarteTimer] = useState<number>()

  useEffect(() => {
    if (!initialized) {
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
  }, [selectedTrack, selectedTalk, initialized])
}

export const useTrailMapTracking = () => {
  const { track: selectedTrack } = useSelectedTrack()
  const { talk: selectedTalk } = useSelectedTalk()

  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)

  const [pointTimer, setPointTimer] = useState<number>()

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()

  useEffect(() => {
    if (!initialized) {
      return
    }
    if (!selectedTrack || !selectedTalk) {
      return
    }
    clearTimeout(pointTimer)
    if (settings.profile.isAttendOffline) {
      return
    }
    if (!selectedTalk.onAir) {
      return
    }

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
  }, [selectedTrack, selectedTalk, initialized])
}

export const useLiveTalkUpdate = (eventAbbr: string, fn: () => void) => {
  const dispatch = useDispatch()
  const { track: selectedTrack } = useSelectedTrack()
  const { talk: selectedTalk } = useSelectedTalk()
  const isLiveMode = useSelector(isLiveModeSelector)
  const { wsBaseUrl } = useSelector(authSelector)

  const [chatCable, setChatCable] = useState<ActionCable.Cable | null>(null)

  useEffect(() => {
    if (chatCable) chatCable.disconnect()
    chatCable?.ensureActiveConnection()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionCable = require('actioncable')
    const actionCableUrl = new URL('/cable', wsBaseUrl).toString()
    const cable = actionCable.createConsumer(actionCableUrl)
    setChatCable(cable)

    cable.subscriptions.create(
      { channel: 'OnAirChannel', eventAbbr: eventAbbr },
      {
        received: (nextTalks: { [trackId: number]: Talk }) => {
          fn()
          dispatch(updateViewTalkWithLiveOne(nextTalks))
          dispatch(patchTalksOnAir(nextTalks))
        },
      },
    )
    // TODO reconsider the trigger to re-connect actioncable
  }, [selectedTrack, isLiveMode, selectedTalk])
}

export const useSizeChecker = () => {
  const theme = useTheme()
  const isSmallerThanMd = !useMediaQuery(theme.breakpoints.up('md'))
  return isSmallerThanMd
}
