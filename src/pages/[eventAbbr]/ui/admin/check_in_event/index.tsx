import { NextPage } from 'next'
import React, { useMemo } from 'react'
import { Layout } from '../../../../../components/Layout'
import { useGetApiV1EventsByEventAbbrQuery } from '../../../../../generated/dreamkast-api.generated'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { authSelector } from '../../../../../store/auth'
import { withAuthProvider } from '../../../../../context/auth'
import Error404 from '../../../../404'
import { CheckIn } from '../../../../../components/CheckIn/CheckIn'
import { Typography } from '@material-ui/core'

const IndexPage: NextPage = () => {
  return withAuthProvider(<IndexMain />)
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
  const skip = eventAbbr === null
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )

  const includeAdminRole = roles.some((role) =>
    [`${eventAbbr.toUpperCase()}-Admin`].includes(role),
  )

  if (event) {
    if (includeAdminRole) {
      return (
        <Layout title={event.name} event={event} isAdminRole={includeAdminRole}>
          <Typography variant="h5">イベント受付</Typography>
          <CheckIn checkInType={'event'} />
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
