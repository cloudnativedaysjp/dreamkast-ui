import { NextPage } from 'next'
import React, { useContext, useMemo } from 'react'
import { Layout } from '../../../../../components/Layout'
import { useGetApiV1EventsByEventAbbrQuery } from '../../../../../generated/dreamkast-api.generated'
import { useRouter } from 'next/router'
import { withAuthProvider } from '../../../../../context/auth'
import Error404 from '../../../../404'
import { CheckIn } from '../../../../../components/CheckIn/CheckIn'
import { Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { authSelector } from '../../../../../store/auth'
import { PrivateCtx } from '../../../../../context/private'

const IndexPage: NextPage = () => {
  const { env } = useContext(PrivateCtx)
  return withAuthProvider(
    <IndexMain />,
    `${env.NEXT_PUBLIC_BASE_PATH}/admin/check_in_event`,
  )
}

const IndexMain = () => {
  const router = useRouter()
  const eventAbbr = useMemo<string>(() => {
    if (router.asPath !== router.route) {
      const { eventAbbr } = router.query
      return eventAbbr as string
    }
    return ''
  }, [router])
  const { roles } = useSelector(authSelector)
  const isAdminRole = roles.includes(`${eventAbbr.toUpperCase()}-Admin`)
  const skip = eventAbbr === null
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )

  if (event) {
    if (isAdminRole) {
      return (
        <Layout title={event.name} event={event}>
          <Typography variant="h5">
            イベント受付 ({event.abbr.toUpperCase()})
          </Typography>
          <CheckIn checkInType={'event'} eventAbbr={event.abbr} />
        </Layout>
      )
    } else {
      return (
        <Layout title={event.name} event={event}>
          {Error404()}
        </Layout>
      )
    }
  } else {
    return <div></div>
  }
}

export default IndexPage
