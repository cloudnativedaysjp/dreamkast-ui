import { Layout } from '../../../../components/Layout'
import { Miro } from '../../../../components/Miro'
import { Button, Grid } from '@material-ui/core'
import * as CommonStyled from '../../../../styles/styled'
import { NextPage } from 'next'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
  useGetApiV1EventsByEventAbbrQuery,
  useGetApiV1ByEventAbbrMyProfileQuery,
} from '../../../../generated/dreamkast-api.generated'
import { setProfile } from '../../../../store/settings'
import { useRouter } from 'next/router'

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
  const skip = eventAbbr === null
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
  return (
    <Layout title="DiscussionBoard - CNDT 2022" event={event}>
      <CommonStyled.OuterContainer
        container
        spacing={1}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={12}>
          <CommonStyled.Container>
            <CommonStyled.Header2 centerized={true}>
              DiscussionBoard
            </CommonStyled.Header2>
            <CommonStyled.CenterizedContainer>
              <Button
                variant="contained"
                color="secondary"
                href="https://miro.com/app/board/uXjVPWsauOI=/"
              >
                参加する
              </Button>
            </CommonStyled.CenterizedContainer>
            <Miro
              miroId="uXjVPWsauOI="
              liveEmbed={false}
              viewport="moveToViewport=-933,-551,1924,1208"
            />
          </CommonStyled.Container>
        </Grid>
      </CommonStyled.OuterContainer>
    </Layout>
  )
}

export default IndexPage
