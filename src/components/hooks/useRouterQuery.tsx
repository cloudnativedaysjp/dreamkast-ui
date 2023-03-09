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
            eventAbbr: router.query['eventAbbr'],
            sessionPointEventId: router.query['get-session-point'],
            pointEventId: router.query['get-point'],
          }
        : {}
    ) as QueryParams
  }, [router.isReady])

  return params
}
