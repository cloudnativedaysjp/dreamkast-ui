import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../../components/Layout'
import { TrackSelector } from '../../../components/TrackSelector'
import { TrackView } from '../../../components/Track'
import { isStorageAvailable } from '../../../util/sessionstorage'
import {
  useGetApiV1TracksQuery,
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1ByEventAbbrMyProfileQuery,
  Track,
  useGetApiV1AppDataByProfileIdConferenceAndConferenceQuery,
} from '../../../generated/dreamkast-api.generated'
import { NextPage } from 'next'
import {setProfile, setEventAbbr, setAppData} from '../../../store/settings'
import { useDispatch } from 'react-redux'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const eventAbbr = useMemo<string>(() => {
    if (router.asPath !== router.route) {
      const { eventAbbr } = router.query
      return eventAbbr as string
    }
    return ''
  }, [router])
  useEffect(() => {
    dispatch(setEventAbbr(eventAbbr))
  }, [eventAbbr])

  const skip = eventAbbr === null
  const v1TracksQuery = useGetApiV1TracksQuery({ eventAbbr }, { skip })
  const { data: event } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr },
    { skip },
  )
  const myProfileQuery = useGetApiV1ByEventAbbrMyProfileQuery(
    { eventAbbr },
    { skip },
  )
  useEffect(() => {
    if (myProfileQuery.data) {
      dispatch(setProfile(myProfileQuery.data))
    }
  }, [myProfileQuery.data])

  const appDataQuery =
    useGetApiV1AppDataByProfileIdConferenceAndConferenceQuery(
      { profileId: `${myProfileQuery?.data?.id}`, conference: eventAbbr },
      { skip: !myProfileQuery?.data?.id },
    )
  useEffect(() => {
    if (appDataQuery.data) {
      dispatch(setAppData(appDataQuery.data))
    }
  }, [appDataQuery.data])

  const getTrack = () => {
    if (!v1TracksQuery.data) {
      return null
    }
    const tracks = v1TracksQuery.data
    if (isStorageAvailable('sessionStorage')) {
      const num = sessionStorage.getItem('view_track_id') || tracks[0].id
      return tracks.find((track) => track.id == num) || null
    } else {
      return tracks[0]
    }
  }

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(getTrack())

  const selectTrack = useCallback(
    (selectedTrack: Track) => setSelectedTrack(selectedTrack),
    [],
  )

  useEffect(() => {
    const track = getTrack()
    if (track) {
      setSelectedTrack(track)
    }
  }, [v1TracksQuery.data])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <TrackSelector
          tracks={v1TracksQuery.data ?? []}
          selectedTrack={selectedTrack}
          selectTrack={selectTrack}
        />
        <TrackView event={event} selectedTrack={selectedTrack} />
      </Layout>
    )
  } else {
    return <div></div>
  }
}

export default IndexPage
