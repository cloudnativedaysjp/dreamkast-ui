import { useContext, useEffect, useMemo, useState } from 'react'
import { PrivateCtx } from '../../context/private'
import { useDispatch, useSelector } from 'react-redux'
import {
  profileSelector,
  settingsInitializedSelector,
} from '../../store/settings'
import { useRouterQuery } from './useRouterQuery'
import {
  useGetApiV1TalksByTalkIdQuery,
  useGetApiV1TracksQuery,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../generated/dreamkast-api.generated'
import {
  clearSessionPointEventId,
  getSessionEventNum,
  getSessionPointEventId,
  getSlotId,
  makeTrackResolveMap,
} from '../../util/sessionstorage/trailMap'
import {
  setPointEventSaving,
  setStampAddedByQRCode,
  setTrailMapOpen,
} from '../../store/appData'

type OnAirTalk = {
  talk_id: number
  [k: string]: any
}
export const usePostSessionPointEvent = () => {
  const dispatch = useDispatch()
  const { isReady, eventAbbr } = useRouterQuery()
  const profile = useSelector(profileSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const { getPointEventId } = useContext(PrivateCtx)

  const [talkId, setTalkId] = useState<number | null>(null)
  const [trackId, setTrackId] = useState<number | null>(null)
  const [isDone, setDone] = useState<boolean>(false)

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  const eventMap = useMemo(() => {
    return makeTrackResolveMap(getPointEventId)
  }, [eventAbbr])

  const tracksQuery = useGetApiV1TracksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )
  const talksQuery = useGetApiV1TalksByTalkIdQuery(
    { talkId: `${talkId}` },
    { skip: talkId === null },
  )

  useEffect(() => {
    if (trackId) {
      return
    }
    if (!isReady) {
      return
    }

    const sessionPointEventId = getSessionPointEventId()
    if (!sessionPointEventId) {
      setDone(true)
      return
    }
    dispatch(setPointEventSaving(true))
    if (!initialized || !tracksQuery.data) {
      return
    }
    const trackPos = eventMap[sessionPointEventId as string]
    const track = tracksQuery.data[trackPos]

    if (!track?.onAirTalk) {
      console.warn('no onAir talk')
      clearSessionPointEventId()
      dispatch(setPointEventSaving(false))
      return
    }
    setTrackId(track.id)
    setTalkId((track.onAirTalk as OnAirTalk).talk_id)
  }, [isReady, initialized, tracksQuery, isDone])

  useEffect(() => {
    if (isDone) {
      return
    }
    if (!trackId || !talksQuery.data) {
      return
    }
    const slotId = getSlotId(talksQuery.data)
    if (slotId === 0) {
      return
    }

    ;(async () => {
      const eventNum = getSessionEventNum(slotId)
      console.warn(eventNum)
      const pointEventId = getPointEventId(eventNum)
      try {
        await postPointEvent({
          profileId: `${profile.id}`,
          profilePoint: {
            conference: eventAbbr,
            pointEventId,
          },
        })
        const res = await mutateAppData({
          profileId: `${profile.id}`,
          conference: eventAbbr,
          dkUiDataMutation: {
            action: 'stampedFromQR',
            payload: {
              talkId,
              trackId,
              slotId,
            },
          },
        }).unwrap()
        dispatch(setStampAddedByQRCode(true))
        dispatch(setTrailMapOpen(true))
        if (res.status !== 'ok') {
          console.warn(res)
          return
        }
      } catch (err) {
        console.error('stampFromQR Action', err)
      } finally {
        setDone(true)
        clearSessionPointEventId()
        dispatch(setPointEventSaving(false))
      }
    })()
  }, [talksQuery.data, initialized])
}
