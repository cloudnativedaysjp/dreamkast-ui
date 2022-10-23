import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { isStorageAvailable } from '../../../util/sessionstorage'
import {
  useGetApiV1TracksQuery,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1ByEventAbbrMyProfileQuery,
  Track,
} from '../../../generated/dreamkast-api.generated'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const eventAbbr = useMemo<string>(() => {
    if (router.asPath !== router.route) {
      const { eventAbbr } = router.query
      return eventAbbr as string
    }
    return ''
  }, [router])
  const skip = eventAbbr === null
  const v1TracksQuery = useGetApiV1TracksQuery({ eventAbbr }, { skip })
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )
  const myProfileQuery = useGetApiV1ByEventAbbrMyProfileQuery(
    { eventAbbr },
    { skip },
  )

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
    if ((myProfileQuery.error as FetchBaseQueryError)?.status === 403) {
      const topUrl = window.location.href.replace('/ui', '')
      window.location.href = topUrl
    }
  }, [myProfileQuery.error])

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
        <TrackView
          event={event}
          profile={myProfileQuery.data}
          selectedTrack={selectedTrack}
        />
      </Layout>
    )
  } else {
    return <div></div>
  }
}

export default IndexPage
