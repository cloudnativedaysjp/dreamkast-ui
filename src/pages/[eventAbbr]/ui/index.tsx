import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { isStorageAvailable } from '../../../util/sessionstorage'
import {
  useGetApiV1TracksQuery,
  Track,
  useGetApiV1TalksQuery,
} from '../../../generated/dreamkast-api.generated'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useAppDataSetup } from '../../../components/hooks/useAppDataSetup'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { setTalks } from '../../../store/settings'

const IndexPage: NextPage = () => {
  const dispatch = useDispatch()
  const { eventAbbr, event } = useInitSetup()
  const [_, setError] = useState()
  useAppDataSetup()

  const v1TracksQuery = useGetApiV1TracksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )

  const dayId = useMemo(() => {
    const today = dayjs(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DD')
    let dayId = ''
    event?.conferenceDays?.forEach((day) => {
      if (day.date == today && day.id) {
        dayId = String(day.id)
      }
    })
    return dayId
  }, [event])

  const { data, isLoading, isError, error } = useGetApiV1TalksQuery(
    {
      eventAbbr: eventAbbr,
      conferenceDayIds: dayId,
    },
    { skip: !dayId },
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

  const getTrack = () => {
    if (!v1TracksQuery.data) {
      return null
    }
    const tracks = v1TracksQuery.data
    if (isStorageAvailable('sessionStorage')) {
      const num = sessionStorage.getItem('view_track_id') || tracks[0].id
      return tracks.find((track) => track.id == num) || null
    } else {
      return tracks[0]
    }
  }

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(getTrack())

  const selectTrack = useCallback(
    (selectedTrack: Track) => setSelectedTrack(selectedTrack),
    [],
  )

  useEffect(() => {
    const track = getTrack()
    if (track) {
      setSelectedTrack(track)
    }
  }, [v1TracksQuery.data])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <TrackSelector
          tracks={v1TracksQuery.data ?? []}
          selectedTrack={selectedTrack}
          selectTrack={selectTrack}
        />
        <TrackView event={event} selectedTrack={selectedTrack} />
      </Layout>
    )
  } else {
    return <div></div>
  }
}

export default IndexPage
