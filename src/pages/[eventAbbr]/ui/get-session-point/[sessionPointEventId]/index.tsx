import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouterQuery } from '../../../../../components/hooks/useRouterQuery'
import { setSessionPointEventId } from '../../../../../util/sessionstorage/trailMap'
import { useRouter } from 'next/router'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { eventAbbr, sessionPointEventId } = useRouterQuery()

  useEffect(() => {
    setSessionPointEventId(sessionPointEventId!)
    router.replace(`/${eventAbbr}/ui`, undefined, { shallow: true })
  }, [])
  return <></>
}

export default IndexPage
