import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { gql } from '../../../src/__generated__/gql'
import { ConfName } from '../../../src/__generated__/graphql'

export const useViewerCount = (
  eventAbbr: string,
  profileId: number | undefined,
  selectedTrackName: string | undefined,
) => {
  const [viewerCount, setViewerCount] = useState<number>(0)
  const [curTrack, setCurTrack] = useState<string>('')

  const getViewCount = gql(`
    query GetViewerCount($confName: ConfName!) {
      viewerCount(confName: $confName) {
        trackName
        count
      }
    }
  `)

  const { data, loading, error, refetch } = useQuery(getViewCount, {
    variables: { confName: eventAbbr as ConfName },
    skip: !selectedTrackName,
    pollInterval: 60 * 1000,
  })

  const viewTrack = gql(`
    mutation ViewTrack($profileID: Int!, $trackName: String!) {
      viewTrack(input: { profileID: $profileID, trackName: $trackName })
    }
  `)

  const [setViewTrack, { error: viewTrackError }] = useMutation(viewTrack)

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

  useEffect(() => {
    if (!profileId || !selectedTrackName) {
      return
    }
    if (selectedTrackName === curTrack) {
      return
    }
    setViewTrack({
      variables: {
        profileID: profileId,
        trackName: selectedTrackName,
      },
    })
    refetch()
    setCurTrack(selectedTrackName)
  }, [selectedTrackName, profileId])

  useEffect(() => {
    if (viewTrackError) {
      // TODO error handling
      console.error(viewTrackError)
      return
    }
  }, [viewTrackError])

  return viewerCount
}
