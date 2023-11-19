import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { gql } from '../../../src/__generated__/gql'
import { ConfName } from '../../../src/__generated__/graphql'

export const useViewerCount = (
  eventAbbr: string,
  profileId: number | undefined,
  selectedTrackName: string | undefined,
): [number, NodeJS.Timeout | null] => {
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({})
  const [curTrack, setCurTrack] = useState<string>('')
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  // fetch viewer count
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

  const viewTrack = gql(`
    mutation ViewTrack($profileID: Int!, $trackName: String!) {
      viewTrack(input: { profileID: $profileID, trackName: $trackName })
    }
  `)
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
      setViewerCounts(
        data.viewerCount.reduce((acc, cur) => {
          acc[cur.trackName] = cur.count
          return acc
        }, {} as Record<string, number>),
      )
    }
  }, [data, loading, error, selectedTrackName])

  // mutate viewer count
  const [setViewTrack, { error: viewTrackError }] = useMutation(viewTrack)

  useEffect(() => {
    if (!profileId || !selectedTrackName) {
      return
    }
    if (selectedTrackName === curTrack) {
      return
    }
    if (timer) {
      clearInterval(timer)
      setTimer(null)
    }
    const mutate = () => {
      setViewTrack({
        variables: {
          profileID: profileId,
          trackName: selectedTrackName,
        },
      })
    }
    mutate()
    setTimer(setInterval(mutate, 30 * 1000))

    setCurTrack(selectedTrackName)
  }, [selectedTrackName, profileId, timer, curTrack])

  useEffect(() => {
    if (viewTrackError) {
      // TODO error handling
      console.error(viewTrackError)
      return
    }
  }, [viewTrackError])

  return [selectedTrackName ? viewerCounts[selectedTrackName] : 0, timer]
}
