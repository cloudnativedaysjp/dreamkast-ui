import { useDispatch, useSelector } from 'react-redux'
import {
  setInitialViewTalk,
  setTalks,
  settingsSelector,
  setTracks,
} from '../../store/settings'
import {
  useGetApiV1TalksQuery,
  useGetApiV1TracksQuery,
} from '../../generated/dreamkast-api.generated'
import { useCallback, useEffect, useState } from 'react'

export const useGetTalksAndTracks = () => {
  const dispatch = useDispatch()
  const talksQuery = useGetTalks()
  const tracksQuery = useGetTracks()
  const [isDoneFirstQuery, setDoneFirstQuery] = useState<boolean>(false)

  const refetch = useCallback(() => {
    if (!isDoneFirstQuery) {
      return
    }
    talksQuery.refetch()
    tracksQuery.refetch()
  }, [talksQuery.refetch, tracksQuery.refetch])

  useEffect(() => {
    if (isDoneFirstQuery) {
      return
    }
    if (talksQuery.data && tracksQuery.data) {
      dispatch(setInitialViewTalk())
      setDoneFirstQuery(true)
    }
  }, [talksQuery.data, tracksQuery.data, isDoneFirstQuery])

  return {
    isLoading: talksQuery.isLoading || tracksQuery.isLoading,
    refetch,
  }
}

export const useGetTalks = () => {
  const dispatch = useDispatch()
  const [_, setError] = useState()
  const { eventAbbr, conferenceDay } = useSelector(settingsSelector)

  const { data, isLoading, isError, error, refetch } = useGetApiV1TalksQuery(
    {
      eventAbbr: eventAbbr,
      conferenceDayIds: conferenceDay?.id,
    },
    { skip: !conferenceDay?.id },
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
      dispatch(setTalks(data))
    }
  }, [data, isLoading, isError])

  return {
    data,
    isLoading,
    refetch,
  }
}

export const useGetTracks = () => {
  const dispatch = useDispatch()
  const [_, setError] = useState()
  const { eventAbbr } = useSelector(settingsSelector)

  const { data, isLoading, isError, error, refetch } = useGetApiV1TracksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
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
      dispatch(setTracks(data))
    }
  }, [data, isLoading, isError])

  return {
    data,
    isLoading,
    refetch,
  }
}
