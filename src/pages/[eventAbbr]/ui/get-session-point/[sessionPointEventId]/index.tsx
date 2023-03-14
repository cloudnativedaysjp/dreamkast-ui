import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouterQuery } from '../../../../../components/hooks/useRouterQuery'
import { setSessionPointEventId } from '../../../../../util/sessionstorage/trailMap'

const IndexPage: NextPage = () => {
  const { isReady, eventAbbr, sessionPointEventId } = useRouterQuery()

  useEffect(() => {
    if (!isReady) {
      return
    }
    setSessionPointEventId(sessionPointEventId!)
    window.location.href = `/${eventAbbr}/ui`
  }, [])
  return <></>
}

export default IndexPage
