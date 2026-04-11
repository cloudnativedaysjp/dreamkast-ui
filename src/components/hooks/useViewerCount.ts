import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { gql } from '../../../src/__generated__/gql'
import { ConfName } from '../../../src/__generated__/graphql'

export const useViewerCount = (
  eventAbbr: string,
  profileId: number | undefined,
  selectedTrackName: string | undefined,
  selectedTalkId: number | undefined,
): [number, NodeJS.Timeout | null] => {
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({})
  const [curTrack, setCurTrack] = useState<string>('')
  const [curTalkId, setCurTalkId] = useState<number | undefined>(undefined)
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
    errorPolicy: 'ignore', // エラーを無視してアプリを続行
    onError: (err) => {
      // エラーをログに記録するが、アプリを停止しない
      console.warn('useViewerCount query error (non-critical):', err)
    },
  })

  const viewTrack = gql(`
    mutation ViewTrack($profileID: Int!, $trackName: String!, $talkID: Int!) {
      viewTrack(input: { profileID: $profileID, trackName: $trackName, talkID: $talkID })
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
  const [setViewTrack, { error: viewTrackError }] = useMutation(viewTrack, {
    errorPolicy: 'ignore', // エラーを無視してアプリを続行
    onError: (err) => {
      // エラーをログに記録するが、アプリを停止しない
      console.warn('useViewerCount mutation error (non-critical):', err)
    },
  })

  useEffect(() => {
    if (!profileId || !selectedTrackName || !selectedTalkId) {
      return
    }
    if (selectedTrackName === curTrack && selectedTalkId === curTalkId) {
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
          talkID: selectedTalkId,
        },
      })
    }
    mutate()
    setTimer(setInterval(mutate, 30 * 1000))

    setCurTrack(selectedTrackName)
    setCurTalkId(selectedTalkId)
  }, [selectedTrackName, selectedTalkId, profileId, timer, curTrack, curTalkId])

  useEffect(() => {
    if (viewTrackError) {
      // TODO error handling
      console.error(viewTrackError)
      return
    }
  }, [viewTrackError])

  return [selectedTrackName ? viewerCounts[selectedTrackName] : 0, timer]
}
