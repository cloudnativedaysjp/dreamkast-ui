import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '../../../src/__generated__/gql'
import { ConfName } from '../../../src/__generated__/graphql'

export const useViewerCount = (
  eventAbbr: string,
  selectedTrackId: number | undefined,
) => {
  const [viewerCount, setViewerCount] = useState<number>(0)

  const getViewCount = gql(`
    query GetViewerCount($confName: ConfName!) {
      viewerCount(confName: $confName) {
        trackID
        trackName
        count
      }
    }
  `)

  const { data, loading, error } = useQuery(getViewCount, {
    variables: { confName: eventAbbr as ConfName },
    skip: !selectedTrackId,
    pollInterval: 60 * 1000,
  })

  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      // TODO error handling
      console.error(error)
      return
    }
    if (data) {
      const count = data.viewerCount.find(
        (v) => v.trackID === selectedTrackId,
      )?.count
      if (typeof count === 'number') {
        setViewerCount(count)
      }
    }
  }, [data, loading, error, selectedTrackId])

  return viewerCount
}
