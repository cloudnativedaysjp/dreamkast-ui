import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1ByEventAbbrMyProfileQuery,
  useGetApiV1TalksQuery,
} from '../../../../generated/dreamkast-api.generated'
import { NextPage } from 'next'
import {
  setProfile,
  setTalks,
  settingsSelector,
} from '../../../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../../../../components/Layout'
import { Typography } from '@material-ui/core'
import { ENV } from '../../../../config'
import { withAuthProvider } from '../../../../context/auth'
import { QaList } from '../../../../components/QaList/QaList'

const IndexPage: NextPage = () => {
  return withAuthProvider(<IndexMain />)
}

const IndexMain: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const eventAbbr = useMemo<string>(() => {
    if (router.asPath !== router.route) {
      const { eventAbbr } = router.query
      return eventAbbr as string
    }
    return ''
  }, [router])
  const skip = eventAbbr === null
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )
  const myProfileQuery = useGetApiV1ByEventAbbrMyProfileQuery(
    { eventAbbr },
    { skip },
  )
  const allTalksQuery = useGetApiV1TalksQuery({ eventAbbr }, { skip })
  const settings = useSelector(settingsSelector)

  useEffect(() => {
    if (myProfileQuery.data) {
      dispatch(setProfile(myProfileQuery.data))
    }
  }, [myProfileQuery.data])

  useEffect(() => {
    if (allTalksQuery.data) {
      dispatch(setTalks(allTalksQuery.data))
    }
  }, [allTalksQuery.data])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <Typography variant="h5">質問・回答一覧</Typography>
        <Typography>
          あなたが質問もしくは質問に回答したセッション一覧が表示されます。詳細は各セッションのパネルをクリックして閲覧できます。
        </Typography>
        <QaList event={event} talks={settings.talks}></QaList>
      </Layout>
    )
  } else {
    return <div></div>
  }
}

// TODO move to RootApp component
export const getServerSideProps = async () => {
  return {
    props: {
      env: { ...ENV },
    },
  }
}

export default IndexPage
