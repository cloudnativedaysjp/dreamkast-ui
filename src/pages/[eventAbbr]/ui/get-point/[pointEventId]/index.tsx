import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouterQuery } from '../../../../../components/hooks/useRouterQuery'
import { setPointEventId } from '../../../../../util/sessionstorage/trailMap'

const IndexPage: NextPage = () => {
  const { isReady, eventAbbr, pointEventId } = useRouterQuery()

  useEffect(() => {
    if (!isReady) {
      return
    }
    setPointEventId(pointEventId!)
    window.location.href = `/${eventAbbr}/ui`
  }, [isReady])

  return <></>
}

export default IndexPage
