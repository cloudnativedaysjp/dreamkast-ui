import { useState, useEffect, useCallback } from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { isStorageAvailable } from '../../../util/sessionstorage'
import {
  useGetApiV1TracksQuery,
  useGetApiV1EventsByEventAbbrQuery,
  Track,
} from '../../../generated/dreamkast-api.generated'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useAppDataSetup } from '../../../components/hooks/useAppDataSetup'

const IndexPage: NextPage = () => {
  const { eventAbbr } = useInitSetup()
  useAppDataSetup()

  const v1TracksQuery = useGetApiV1TracksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip: !eventAbbr },
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
