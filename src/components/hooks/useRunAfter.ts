import { useCallback, useState } from 'react'

export const useRunAfter = (fn: () => void, after: number) => {
  const [cancel, setCancel] = useState<NodeJS.Timeout | null>()

  const run = useCallback(() => {
    if (cancel) {
      return
    }
    const c = setTimeout(() => {
      fn()
      setCancel(null)
    }, after)
    setCancel(c)
  }, [cancel, setCancel])

  return {
    run,
  }
}
