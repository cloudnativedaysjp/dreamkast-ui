import React, { useEffect, useState } from 'react'
import { Configuration, Sponsor, SponsorApi } from '../../client-axios'
import * as Styled from './styled'
import { Grid } from '@material-ui/core'
import * as CommonStyled from '../../styles/styled'

type Props = {
  openNewWindow?: boolean
}

export const Booths: React.FC<Props> = ({ openNewWindow }) => {
  const [data, setData] = useState<Sponsor[]>([])

  useEffect(() => {
    new SponsorApi(new Configuration({ basePath: window.location.origin }))
      .apiV1SponsorsGet('cndo2021')
      .then((res) => {
        setData(res.data)
      })
  }, [])

  const windowTarget = () => {
    if (openNewWindow) {
      return '_blank'
    } else {
      return '_self'
    }
  }

  const boothUrl = (id?: number) => {
    if (!id) return
    return '/cndo2021/ui/booths/' + id
  }

  return (
    <Styled.Container>
      <CommonStyled.Header2 centerized={true}>Booths</CommonStyled.Header2>
      <Grid container spacing={1} justify="center" alignItems="flex-start">
        {data.map((sponsor) => {
          if (sponsor.booth && sponsor.booth.id && sponsor.booth.opened) {
            return (
              <Styled.SponsorGridItem item xs={12} md={4}>
                <Styled.SponsorLink
                  href={boothUrl(sponsor.booth.id)}
                  target={windowTarget()}
                >
                  <Styled.SponsorImg src={sponsor.logo_url} />
                </Styled.SponsorLink>
              </Styled.SponsorGridItem>
            )
          }
        })}
      </Grid>
      <a id="booths"></a>
    </Styled.Container>
  )
}
