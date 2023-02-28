import React from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useAppDataSetup } from '../../../components/hooks/useAppDataSetup'
import { useGetTalksAndTracks } from '../../../components/hooks/useGetTalksAndTracks'
import { selectedTrackSelector } from '../../../store/settings'
import { useSelector } from 'react-redux'

const IndexPage: NextPage = () => {
  const { event } = useInitSetup()
  useAppDataSetup()
  const { refetch } = useGetTalksAndTracks()
  const selectedTrack = useSelector(selectedTrackSelector)

  if (!event) {
    return <div></div>
  }
  return (
    <Layout title={event.name} event={event}>
      <TrackSelector />
      <TrackView
        event={event}
        selectedTrack={selectedTrack}
        refetch={refetch}
      />
    </Layout>
  )
}

export default IndexPage
