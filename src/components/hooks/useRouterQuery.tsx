import { useMemo } from 'react'
import { useRouter } from 'next/router'

type QueryParams = {
  isReady: boolean
  eventAbbr: string
  sessionPointEventId?: string
  pointEventId?: string
}

export const useRouterQuery = () => {
  const router = useRouter()
  const params = useMemo<QueryParams>(() => {
    return (
      router.isReady
        ? {
            isReady: router.isReady,
            eventAbbr: router.query.eventAbbr || '',
            pointEventId: router.query.pointEventId,
            sessionPointEventId: router.query.sessionPointEventId,
          }
        : {}
    ) as QueryParams
  }, [router.isReady])

  return params
}
