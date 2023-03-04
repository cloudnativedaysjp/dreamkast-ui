import { useEffect, useState } from 'react'
import { useGetApiV1TracksByTrackIdViewerCountQuery } from '../../generated/dreamkast-api.generated'

export const useViewerCount = (selectedTrackId: number | undefined) => {
  const [viewerCount, setViewerCount] = useState<string>('')

  const { data, isError, isLoading, error } =
    useGetApiV1TracksByTrackIdViewerCountQuery(
      { trackId: `${selectedTrackId}` },
      { skip: !selectedTrackId, pollingInterval: 60 * 1000 },
    )
  useEffect(() => {
    if (isLoading) {
      return
    }
    if (isError) {
      // TODO error handling
      console.error(error)
      return
    }
    if (data) {
      setViewerCount(data.viewerCount.toString())
    } else {
      setViewerCount('-')
    }
  }, [data, isLoading, isError])

  return viewerCount
}
