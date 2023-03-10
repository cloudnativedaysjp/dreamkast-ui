import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouterQuery } from '../../../../../components/hooks/useRouterQuery'
import { setPointEventId } from '../../../../../util/sessionstorage/trailMap'
import { useRouter } from 'next/router'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { eventAbbr, pointEventId } = useRouterQuery()

  useEffect(() => {
    setPointEventId(pointEventId!)
    router.replace(`/${eventAbbr}/ui`, undefined, { shallow: true })
  }, [])

  return <></>
}

export default IndexPage
