import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
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

export const useInitSetup = (eventAbbr: string) => {
  const dispatch = useDispatch()

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

  return {
    event: eventQuery.data,
    profile: myProfileQuery.data,
  }
}
