import React, { useState, useEffect, useCallback } from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { isStorageAvailable } from '../../../util/sessionstorage'
import { Track } from '../../../generated/dreamkast-api.generated'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useAppDataSetup } from '../../../components/hooks/useAppDataSetup'
import { useGetTalksAndTracks } from '../../../components/hooks/useGetTalksAndTracks'
import { settingsSelector } from '../../../store/settings'
import { useSelector } from 'react-redux'

const IndexPage: NextPage = () => {
  const { event } = useInitSetup()
  useAppDataSetup()
  const { refetch } = useGetTalksAndTracks()
  const { tracks } = useSelector(settingsSelector)

  const getTrack = () => {
    if (tracks.length === 0) {
      return null
    }
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
  }, [tracks])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <TrackSelector
          selectedTrack={selectedTrack}
          selectTrack={selectTrack}
        />
        <TrackView
          event={event}
          selectedTrack={selectedTrack}
          refetch={refetch}
        />
      </Layout>
    )
  } else {
    return <div></div>
  }
}

export default IndexPage
