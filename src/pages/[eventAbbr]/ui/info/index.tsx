import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1ByEventAbbrMyProfileQuery,
} from '../../../../generated/dreamkast-api.generated'
import { NextPage } from 'next'
import { setProfile } from '../../../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../../../store/auth'
import { Layout } from '../../../../components/Layout'
import { RegisteredTalks } from '../../../../components/RegisteredTalks'
import { Typography } from '@material-ui/core'
import { ENV } from '../../../../config'

const IndexPage: NextPage = () => {
  return <IndexMain />
}

const IndexMain: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { dkUrl } = useSelector(authSelector)
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
  useEffect(() => {
    if (myProfileQuery.data) {
      dispatch(setProfile(myProfileQuery.data))
    }
  }, [myProfileQuery.data])
  useEffect(() => {
    const error = myProfileQuery.error
    if (
      error &&
      'status' in error &&
      error.status === 404 &&
      eventAbbr &&
      dkUrl
    ) {
      window.location.href = `${dkUrl}/${eventAbbr}/registration`
    }
  }, [myProfileQuery.error, eventAbbr, dkUrl])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <Typography variant="h5">聴講予定セッション</Typography>
        <RegisteredTalks event={event} />
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
