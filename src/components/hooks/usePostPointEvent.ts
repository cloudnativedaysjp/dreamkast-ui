import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  profileSelector,
  settingsInitializedSelector,
} from '../../store/settings'
import { useRouterQuery } from './useRouterQuery'
import { usePostApiV1ProfileByProfileIdPointMutation } from '../../generated/dreamkast-api.generated'
import { setPointEventSaving, setTrailMapOpen } from '../../store/appData'
import { useRouter } from 'next/router'

export const usePostPointEvent = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isReady, eventAbbr, pointEventId } = useRouterQuery()
  const profile = useSelector(profileSelector)
  const initialized = useSelector(settingsInitializedSelector)

  const [isDone, setDone] = useState<boolean>(false)

  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  useEffect(() => {
    if (isDone) {
      return
    }
    if (!isReady) {
      return
    }
    if (!pointEventId) {
      setDone(true)
      return
    }
    dispatch(setPointEventSaving(true))
    if (!initialized) {
      return
    }

    postPointEvent({
      profileId: `${profile.id}`,
      profilePoint: {
        conference: eventAbbr,
        pointEventId,
      },
    })
      .unwrap()
      .then((res) => {
        dispatch(setTrailMapOpen(true))
        if (res.status !== 'ok') {
          console.warn(res)
          return
        }
      })
      .catch((err) => {
        console.error('stampFromUI Action', err)
      })
      .finally(() => {
        setDone(true)
        dispatch(setPointEventSaving(false))
        router.replace(`/${eventAbbr}/ui`, undefined, { shallow: true })
      })
  }, [
    isReady,
    pointEventId,
    initialized,
    isDone,
    postPointEvent,
    profile,
    eventAbbr,
  ])
}
