import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadFromStorage,
  setEvent,
  setEventAbbr,
  setProfile,
} from '../../store/settings'
import {
  useGetApiV1ByEventAbbrMyProfileQuery,
  useGetApiV1EventsByEventAbbrQuery,
} from '../../generated/dreamkast-api.generated'
import { authSelector } from '../../store/auth'

export const useInitSetup = (eventAbbr: string) => {
  const dispatch = useDispatch()
  const { dkUrl } = useSelector(authSelector)

  useEffect(() => {
    dispatch(loadFromStorage())
  }, [])

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
  useEffect(() => {
    const error = myProfileQuery.error
    if (
      error &&
      'status' in error &&
      error.status === 404 &&
      eventAbbr &&
      dkUrl
    ) {
      window.location.href = `${dkUrl}/${eventAbbr}/registration`
    }
  }, [myProfileQuery.error, eventAbbr, dkUrl])

  return {
    event: eventQuery.data,
    profile: myProfileQuery.data,
  }
}
