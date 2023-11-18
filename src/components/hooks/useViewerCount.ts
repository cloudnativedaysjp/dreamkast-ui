import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '../../../src/__generated__/gql'
import { ConfName } from '../../../src/__generated__/graphql'

export const useViewerCount = (
  eventAbbr: string,
  selectedTrackName: String | undefined,
) => {
  const [viewerCount, setViewerCount] = useState<number>(0)

  const getViewCount = gql(`
    query GetViewerCount($confName: ConfName!) {
      viewerCount(confName: $confName) {
        trackName
        count
      }
    }
  `)

  const { data, loading, error } = useQuery(getViewCount, {
    variables: { confName: eventAbbr as ConfName },
    skip: !selectedTrackName,
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
        (v) => v.trackName === selectedTrackName,
      )?.count
      if (typeof count === 'number') {
        setViewerCount(count)
      }
    }
  }, [data, loading, error, selectedTrackName])

  return viewerCount
}
