import { useState, useEffect, useCallback } from 'react'
import { Layout } from '../components/Layout'
import { TrackSelector } from '../components/TrackSelector'
import { TrackView } from '../components/Track'
import {
  Track,
  TrackApi,
  Configuration,
  ProfileApi,
  Profile,
} from '../client-axios'

const IndexPage: React.FC = () => {
  // States
  const [selectedTrack, setSelectedTrack] = useState<Track>()
  const [tracks, setTracks] = useState<Track[]>([])
  const [profile, setProfile] = useState<Profile>()

  // Handlers
  const selectTrack = (selectedTrack: Track) => {
    setSelectedTrack(selectedTrack)
  }

  const getProfile = useCallback(async () => {
    const api = new ProfileApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await api.apiV1EventAbbrMyProfileGet('cndo2021')
    setProfile(data)
    console.log(data)
  }, [])

  const getTracks = useCallback(async () => {
    const api = new TrackApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await api.apiV1TracksGet('cndo2021')
    setTracks(data)
    setSelectedTrack(data[0])
  }, [])

  useEffect(() => {
    getProfile()
    getTracks()
  }, [])

  return (
    <Layout title="CloudNative Days 2021">
      <TrackSelector
        tracks={tracks}
        selectedTrack={selectedTrack}
        selectTrack={selectTrack}
      />
      <TrackView profile={profile} selectedTrack={selectedTrack} />
    </Layout>
  )
}

export default IndexPage
