import { useMemo } from 'react'
import { useRouter } from 'next/router'

export const useRouterQuery = () => {
  const router = useRouter()
  const eventAbbr = useMemo<string>(() => {
    const { eventAbbr } = router.query
    return router.isReady ? (eventAbbr as string) : ''
  }, [router.isReady])

  return {
    eventAbbr,
  }
}
