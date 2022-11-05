import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout'
import { TrackSelector } from '../components/TrackSelector'
import { TrackView } from '../components/Track'
import {
  Track,
  useGetApiV1TracksQuery,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1ByEventAbbrMyProfileQuery,
} from '../generated/dreamkast-api.generated'
import { getViewTrackIdFromSessionStorage } from '../util/viewTrackId'
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  const router = useRouter()

  const eventAbbr = useMemo<string>(() => {
    const r = /^\/(.*)\/ui$/m
    const result = router.basePath.match(r)
    if (result && result.length > 1) {
      return result[1] as string
    }
    return ''
  }, [router])

  const skip = eventAbbr === ''
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )

  const tracksQuery = useGetApiV1TracksQuery({ eventAbbr }, { skip })
  const tracks = useMemo(() => {
    return tracksQuery.data || []
  }, [tracksQuery.data])

  const myProfileQuery = useGetApiV1ByEventAbbrMyProfileQuery(
    { eventAbbr },
    { skip },
  )

  const getInitialSelectedTrack = (): Track | null => {
    if (!tracksQuery.data) {
      return null
    }
    const viewTrackId = getViewTrackIdFromSessionStorage() || tracks[0]?.id
    return tracks.find((track) => track.id === viewTrackId) || null
  }

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(
    getInitialSelectedTrack,
  )

  useEffect(() => {
    if (
      myProfileQuery.error &&
      'status' in myProfileQuery.error &&
      myProfileQuery.error.status === 403
    ) {
      router.replace('/ui')
    }
  }, [myProfileQuery])

  useEffect(() => {
    if (selectedTrack) {
      return
    }
    setSelectedTrack(getInitialSelectedTrack())
  }, [tracksQuery.data])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <TrackSelector
          tracks={tracks}
          selectedTrack={selectedTrack}
          selectTrack={setSelectedTrack}
        />
        <TrackView event={event} selectedTrack={selectedTrack} />
      </Layout>
    )
  } else {
    return <div></div>
  }
}

export default IndexPage
