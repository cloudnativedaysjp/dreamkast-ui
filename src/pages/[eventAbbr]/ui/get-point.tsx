import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useEffect } from 'react'
import { Layout } from '../../../components/Layout'
import { setTrailMapOpenNext } from '../../../util/sessionstorage/trailMap'
import { usePostApiV1ProfileByProfileIdPointMutation } from '../../../generated/dreamkast-api.generated'
import {
  settingsInitializedSelector,
  settingsSelector,
} from '../../../store/settings'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import { CircularProgress } from '@material-ui/core'
import * as CommonStyled from '../../../styles/styled'
import { useRouterQuery } from '../../../components/hooks/useRouterQuery'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const settings = useSelector(settingsSelector)
  const initialized = useSelector(settingsInitializedSelector)
  const { eventAbbr } = useRouterQuery()
  const { event } = useInitSetup(eventAbbr)

  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  const goTrailMap = useCallback(() => {
    setTrailMapOpenNext()
    router.replace(`/${eventAbbr}/ui`, undefined, { shallow: true })
  }, [eventAbbr])

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!initialized) {
      return
    }
    const { key } = router.query
    if (!key) {
      goTrailMap()
      return
    }
    postPointEvent({
      profileId: `${settings.profile.id}`,
      profilePoint: {
        conference: settings.eventAbbr,
        pointEventId: key as string,
      },
    })
      .unwrap()
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        goTrailMap()
      })
  }, [router.isReady, initialized])

  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <CommonStyled.BaseCenterContainer>
          <CircularProgress color="primary" size={60} />
        </CommonStyled.BaseCenterContainer>
      </Layout>
    )
  }
  return <div></div>
}

export default IndexPage
