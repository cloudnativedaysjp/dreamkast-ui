import React, { useEffect, useState } from 'react'
import { Configuration, Sponsor, SponsorApi } from '../../client-axios'
import * as Styled from './styled'
import { Grid } from '@material-ui/core'

export const Booths: React.FC = () => {
  const [data, setData] = useState<Sponsor[]>([])

  useEffect(() => {
    new SponsorApi(new Configuration({ basePath: window.location.origin }))
      .apiV1SponsorsGet('cndo2021')
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
  }, [])

  const boothUrl = (id?: number) => {
    if (!id) return
    return '/cndo2021/ui/booths/' + id
  }

  return (
    <Styled.Container>
      <Styled.SponsorHeader>Booths</Styled.SponsorHeader>
      <Grid container spacing={1} justify="center" alignItems="flex-start">
        {data.map((sponsor) => {
          if (sponsor.booth && sponsor.booth.id && sponsor.booth.opened) {
            return (
              <Styled.SponsorGridItem item xs={12} md={4}>
                <Styled.SponsorLink
                  href={boothUrl(sponsor.booth.id)}
                  target="_blank"
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
