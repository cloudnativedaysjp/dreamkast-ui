import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouterQuery } from '../../../../../components/hooks/useRouterQuery'
import { setSessionPointEventId } from '../../../../../util/sessionstorage/trailMap'
import { useRouter } from 'next/router'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { isReady, eventAbbr, sessionPointEventId } = useRouterQuery()

  useEffect(() => {
    if (!isReady) {
      return
    }
    setSessionPointEventId(sessionPointEventId!)
    router.replace(`/${eventAbbr}/ui`)
  }, [])
  return <></>
}

export default IndexPage
