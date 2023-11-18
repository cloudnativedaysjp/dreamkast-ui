import { useEffect, useState } from 'react'
import { useMutation, gql as cgql} from '@apollo/client'
import { useSelector } from 'react-redux'
import {
  profileSelector,
  useSelectedTrack,
} from '../../store/settings'

export const usePostViewingTrack = () => {
  const profile = useSelector(profileSelector)
  const { track: selectedTrack } = useSelectedTrack()

  const [viewingTrackTimer, setViewingTrackTimer] = useState<number>()

  const postViewingTrack = cgql(`
    mutation viewTrack($input: ViewTrackInput!) {
      viewTrack(input: $input)
    }
  `)

  const [ pvt ] = useMutation(postViewingTrack)

  useEffect(() => {
    if (!selectedTrack) {
      return
    }
    clearInterval(viewingTrackTimer)
    setViewingTrackTimer(
      window.setInterval(() => {
        pvt({
          variables: {
            input: {
              profileID: profile.id,
              trackName: selectedTrack.name,
            },
          }
        })
      }, 30 * 1000),
    )
  }, [selectedTrack])
}
