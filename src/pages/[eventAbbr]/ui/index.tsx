import React from 'react'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { NextPage } from 'next'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useGetTalksAndTracks } from '../../../components/hooks/useGetTalksAndTracks'
import { useRouterQuery } from '../../../components/hooks/useRouterQuery'
import { NextTalkNotifier } from '../../../components/Layout/NextTalkNotifier'
import { ENV } from '../../../config'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { authSelector } from '../../../store/auth'

const IndexPage: NextPage = () => {
  return <IndexMain />
}

const IndexMain = () => {
  const { eventAbbr } = useRouterQuery()
  const { event } = useInitSetup(eventAbbr)
  const { refetch } = useGetTalksAndTracks()
  const { roles, dkUrl } = useSelector(authSelector)
  const router = useRouter()

  // NOTE: TrailMapが必要になったら、以下の3つとpointEventSavingのガードのコメントアウトを解除する
  // TODO: TrailMapを使わない判断がされたら、TrailMap関連の処理を消す
  // usePostPointEvent()
  // usePostSessionPointEvent()
  // useAppDataSetup()

  if (!event) {
    return <></>
  }
  if (event.status !== 'opened' && roles.length === 0) {
    console.warn(
      'Conference has not opened yet. Please access after the conference started.',
    )
    router.replace(dkUrl)
    return
  }

  // const isPointEventSaving = useSelector(pointEventSavingSelector)
  // if (isPointEventSaving) {
  //   return (
  //     <Layout title={event.name} event={event}>
  //       <CommonStyled.BaseCenterContainer>
  //         <CircularProgress color="primary" size={60} />
  //       </CommonStyled.BaseCenterContainer>
  //     </Layout>
  //   )
  // }

  return (
    <NextTalkNotifier>
      <Layout title={event.name} event={event}>
        <TrackSelector />
        <TrackView event={event} refetch={refetch} />
      </Layout>
    </NextTalkNotifier>
  )
}

// TODO remove this ( seems not needed )
export const getServerSideProps = async () => {
  return {
    props: {
      env: { ...ENV },
    },
  }
}

export default IndexPage
