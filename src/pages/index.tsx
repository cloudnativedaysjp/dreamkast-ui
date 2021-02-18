import { useState, useEffect, useCallback } from 'react'
import { Layout } from '../components/Layout'
import { TrackSelector } from '../components/TrackSelector'
import { TrackView } from '../components/Track'
import { Track, TrackApi } from '../client-axios'

const IndexPage: React.FC = () => {
  // States
  const [selectedTrackId, setSelectedTrackId] = useState<number>(0)
  const [tracks, setTracks] = useState<Track[]>([])

  // Handlers
  const selectTrack = (selectedId: number) => {
    setSelectedTrackId(selectedId)
  }

  const getTracks = useCallback(async () => {
    const api = new TrackApi()
    const { data } = await api.apiV1TracksGet('cndo2021')
    setTracks(data)
    setSelectedTrackId(data[0].id)
  }, [])

  useEffect(() => {
    getTracks()
  }, [])

  return (
    <Layout title="Dreamkast">
      <TrackSelector
        tracks={tracks}
        selectedTrackId={selectedTrackId}
        selectTrack={selectTrack}
      />
      <TrackView selectedTrackId={selectedTrackId} />
    </Layout>
  )
}

export default IndexPage
