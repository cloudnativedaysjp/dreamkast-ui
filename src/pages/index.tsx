import { useState, useEffect, useCallback } from 'react'
import { Layout } from '../components/Layout'
import { TrackSelector } from '../components/TrackSelector'
import { TrackView } from '../components/Track'
import { isStorageAvailable } from '../util/sessionstorage'
import {
  Track,
  TrackApi,
  Configuration,
  ProfileApi,
  Profile,
  Event,
  EventApi,
} from '../client-axios'

const IndexPage: React.FC = () => {
  const eventAbbr = 'cndt2021'
  // States
  const [selectedTrack, setSelectedTrack] = useState<Track>()
  const [tracks, setTracks] = useState<Track[]>([])
  const [profile, setProfile] = useState<Profile>()
  const [event, setEvent] = useState<Event>()

  // Handlers
  const selectTrack = (selectedTrack: Track) => {
    setSelectedTrack(selectedTrack)
  }

  const getEvent = useCallback(async () => {
    const eventApi = new EventApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await eventApi.apiV1EventsEventAbbrGet(eventAbbr)
    setEvent(data)
  }, [])

  const getProfile = useCallback(async () => {
    const api = new ProfileApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const res = await api
      .apiV1EventAbbrMyProfileGet(eventAbbr)
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const topUrl = window.location.href.replace('/ui', '')
          window.location.href = topUrl
        }
      })
    if (!res) return
    setProfile(res.data)
  }, [])

  const getTracks = useCallback(async () => {
    const api = new TrackApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await api.apiV1TracksGet(eventAbbr)
    setTracks(data)

    if (isStorageAvailable('sessionStorage')) {
      setSelectedTrack(
        ((tracks) => {
          const num = sessionStorage.getItem('view_track_id') || tracks[0].id
          return tracks.find((track) => track.id == num)
        })(data),
      )
    } else {
      setSelectedTrack(data[0])
    }
  }, [])

  useEffect(() => {
    getEvent()
    getProfile()
    getTracks()
  }, [])

  if (!!event) {
    return (
      <Layout title="CloudNative Days Tokyo 2021" event={event}>
        <TrackSelector
          tracks={tracks}
          selectedTrack={selectedTrack}
          selectTrack={selectTrack}
        />
        <TrackView
          event={event}
          profile={profile}
          selectedTrack={selectedTrack}
        />
      </Layout>
    )
  } else {
    return <div></div>
  }
}

export default IndexPage
