import React, { useEffect, useState } from 'react'
import { Configuration, Sponsor, SponsorApi } from '../../client-axios'
import * as Styled from './styled'
import { GridList, GridListTile } from '@material-ui/core'

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
    <Styled.Container id="foofoo">
      <GridList cellHeight={160} cols={4}>
        {data.map((sponsor) => {
          if (sponsor.booth && sponsor.booth.id && sponsor.booth.opened) {
            return (
              <GridListTile key={sponsor.name}>
                <a href={boothUrl(sponsor.booth.id)} target="_blank">
                  <Styled.SponsorImg src={sponsor.logo_url} />
                </a>
              </GridListTile>
            )
          }
        })}
      </GridList>
    </Styled.Container>
  )
}
