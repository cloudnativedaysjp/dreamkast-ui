import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useInitSetup } from '../../../components/hooks/useInitSetup'
import { useEffect } from 'react'
import { Layout } from '../../../components/Layout'
import { setTrailMapOpenNext } from '../../../util/trailMap'
import { usePostApiV1ProfileByProfileIdPointMutation } from '../../../generated/dreamkast-api.generated'
import { settingsSelector } from '../../../store/settings'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import { CircularProgress } from '@material-ui/core'
import * as CommonStyled from '../../../styles/styled'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const settings = useSelector(settingsSelector)
  const { eventAbbr, event } = useInitSetup()

  const [postPointEvent] = usePostApiV1ProfileByProfileIdPointMutation()

  const goTrailMap = useCallback(() => {
    setTrailMapOpenNext()
    router.replace(`/${eventAbbr}/ui`, undefined, { shallow: true })
  }, [eventAbbr])

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (!settings.initialized) {
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
  }, [router.isReady, settings.initialized])

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
