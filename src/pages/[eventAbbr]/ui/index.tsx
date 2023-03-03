import React from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useAppDataSetup } from '../../../components/hooks/useAppDataSetup'
import { useGetTalksAndTracks } from '../../../components/hooks/useGetTalksAndTracks'

const IndexPage: NextPage = () => {
  const { event } = useInitSetup()
  useAppDataSetup()
  const { refetch } = useGetTalksAndTracks()

  if (!event) {
    return <div></div>
  }
  return (
    <Layout title={event.name} event={event}>
      <TrackSelector />
      <TrackView event={event} refetch={refetch} />
    </Layout>
  )
}

export default IndexPage
