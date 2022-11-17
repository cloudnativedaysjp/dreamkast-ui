import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setEvent, setEventAbbr, setProfile } from '../../store/settings'
import {
  useGetApiV1ByEventAbbrMyProfileQuery,
  useGetApiV1EventsByEventAbbrQuery,
} from '../../generated/dreamkast-api.generated'

export const useInitSetup = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const eventAbbr = useMemo<string>(() => {
    const { eventAbbr } = router.query
    return router.isReady ? (eventAbbr as string) : ''
  }, [router.isReady])

  useEffect(() => {
    dispatch(setEventAbbr(eventAbbr))
  }, [eventAbbr])

  const eventQuery = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )
  useEffect(() => {
    if (eventQuery.data) {
      dispatch(setEvent(eventQuery.data))
    }
  }, [eventQuery.data])

  const myProfileQuery = useGetApiV1ByEventAbbrMyProfileQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )
  useEffect(() => {
    if (myProfileQuery.data) {
      dispatch(setProfile(myProfileQuery.data))
    }
  }, [myProfileQuery.data])

  return {
    eventAbbr,
    event: eventQuery.data,
    profile: myProfileQuery.data,
  }
}
