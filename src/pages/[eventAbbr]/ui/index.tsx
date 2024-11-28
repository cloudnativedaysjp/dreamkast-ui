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
import { TrackLTView } from '../../../components/TrackLT'
import { showLTSelector } from '../../../store/settings'

const IndexPage: NextPage = () => {
  return <IndexMain />
}

const IndexMain = () => {
  const { eventAbbr } = useRouterQuery()
  const { event } = useInitSetup(eventAbbr)
  const { refetch } = useGetTalksAndTracks()
  const { roles, dkUrl } = useSelector(authSelector)
  const showLT = useSelector(showLTSelector)
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

  const content = `各セッションの休憩時間に、技術コミュニティからのLTを行います！

タイムテーブル
13:00-13:05  一般社団法人LOCAL
13:05-13:10 PHPカンファレンス北海道
13:10-13:15 JBUG札幌
14:05-14:10 学生団体Keisei
14:10-14:15 TechRAMEN Conference
15:05-15:10 札幌PHP勉強会
15:10-15:15 フロントエンドカンファレンス北海道
16:05-16:10 ゆるWeb勉強会@札幌
16:10-16:15 SC4Y
17:05-17:10 Jagu'e'r
17:10-17:15 JAWS-UG 札幌
`

  return (
    <NextTalkNotifier>
      <Layout title={event.name} event={event}>
        <TrackSelector />
        {showLT ? (
          <TrackLTView
            event={event}
            youtubeEmbedLink="https://www.youtube.com/embed/BnG_d63F2Gg?si=APRIZB08E5Cb0lrI&autoplay=1"
            title="コミュニティLT"
            content={content}
          />
        ) : (
          <TrackView event={event} refetch={refetch} />
        )}
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
