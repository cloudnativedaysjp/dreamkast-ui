import { useEffect, useState } from 'react'
import { useGetApiV1TracksByTrackIdViewerCountQuery } from '../../generated/dreamkast-api.generated'

export const useViewerCount = (selectedTrackId: number | undefined) => {
  const [viewerCount, setViewerCount] = useState<number>(0)

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
      setViewerCount(data.viewerCount)
    }
  }, [data, isLoading, isError])

  return viewerCount
}
