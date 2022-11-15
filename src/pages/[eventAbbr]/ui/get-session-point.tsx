import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useEffect, useMemo } from 'react'
import { Layout } from '../../../components/Layout'
import {
  getPointEventId,
  getSlotId,
  makeTrackResolveMap,
} from '../../../util/stampCollecting'
import {
  useGetApiV1TalksByTalkIdQuery,
  useGetApiV1TracksQuery,
  usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation,
  usePostApiV1ProfileByProfileIdPointMutation,
} from '../../../generated/dreamkast-api.generated'
import { settingsSelector } from '../../../store/settings'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'

type OnAirTalk = {
  talk_id: number
  [k: string]: any
}

const IndexPage: NextPage = () => {
  const router = useRouter()
  const [talkId, setTalkId] = useState<number | null>(null)
  const [trackId, setTrackId] = useState<number | null>(null)
  const settings = useSelector(settingsSelector)
  const { eventAbbr, event } = useInitSetup()

  const [mutateAppData] =
    usePostApiV1AppDataByProfileIdConferenceAndConferenceMutation()
  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  const eventMap = useMemo(() => {
    return makeTrackResolveMap(eventAbbr)
  }, [eventAbbr])

  const tracksQuery = useGetApiV1TracksQuery(
    { eventAbbr },
    { skip: !eventAbbr },
  )
  const talksQuery = useGetApiV1TalksByTalkIdQuery(
    { talkId: `${talkId}` },
    { skip: talkId === null },
  )

  useEffect(() => {
    const { key } = router.query
    if (!key) {
      router.push(`/${eventAbbr}/ui`)
      return
    }
    if (!tracksQuery.data) {
      return
    }
    const trackPos = eventMap[key as string]
    const track = tracksQuery.data[trackPos]
    console.log(track)
    if (!track.onAirTalk) {
      router.push(`/${eventAbbr}/ui`)
      return
    }
    console.warn('#######1', track.id)
    console.warn('#######2', track)
    console.warn('#######3', track.onAirTalk)
    setTrackId(track.id)
    setTalkId((track.onAirTalk as OnAirTalk).talk_id)
  }, [router.isReady, tracksQuery.data, eventMap])

  // TODO add point using slotID/trackID/talkID
  useEffect(() => {
    if (!talksQuery.data) {
      return
    }
    const slotId = getSlotId(talksQuery.data)

    ;(async () => {
      const pointEventId = getPointEventId(
        // TODO use random secret as salt
        eventAbbr,
        slotId,
      )
      try {
        await postPointEvent({
          profileId: `${settings.profile.id}`,
          profilePoint: {
            conference: settings.eventAbbr,
            pointEventId,
          },
        })
        await mutateAppData({
          profileId: `${settings.profile.id}`,
          conference: settings.eventAbbr,
          dkUiDataMutation: {
            action: 'stampedFromQR',
            payload: {
              talkId,
              trackId,
              slotId,
            },
          },
        })
      } catch (err) {
        console.error('stampFromUI Action', err)
      }
    })()
  }, [talksQuery.data])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <div></div>
      </Layout>
    )
  }
  return <div></div>
}

export default IndexPage
