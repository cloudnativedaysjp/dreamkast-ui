import React from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useGetTalksAndTracks } from '../../../components/hooks/useGetTalksAndTracks'
import { useRouterQuery } from '../../../components/hooks/useRouterQuery'
import { useAppDataSetup } from '../../../components/hooks/useAppDataSetup'
import { withAuthProvider } from '../../../context/auth'
import { usePostPointEvent } from '../../../components/hooks/usePostPointEvent'
import { usePostSessionPointEvent } from '../../../components/hooks/usePostSessionPointEvent'
import { useSelector } from 'react-redux'
import { pointEventSavingSelector } from '../../../store/appData'
import { CircularProgress } from '@material-ui/core'
import * as CommonStyled from '../../../styles/styled'

const IndexPage: NextPage = () => {
  return withAuthProvider(<IndexMain />)
}

const IndexMain = () => {
  const { eventAbbr } = useRouterQuery()
  const { event } = useInitSetup(eventAbbr)
  const { refetch } = useGetTalksAndTracks()
  usePostPointEvent()
  usePostSessionPointEvent()
  useAppDataSetup()

  const isPointEventSaving = useSelector(pointEventSavingSelector)

  if (!event) {
    return <></>
  }
  if (isPointEventSaving) {
    return (
      <Layout title={event.name} event={event}>
        <CommonStyled.BaseCenterContainer>
          <CircularProgress color="primary" size={60} />
        </CommonStyled.BaseCenterContainer>
      </Layout>
    )
  }

  return (
    <Layout title={event.name} event={event}>
      <TrackSelector />
      <TrackView event={event} refetch={refetch} />
    </Layout>
  )
}

export default IndexPage
