import React, { useState, useEffect } from 'react'
import { SponsorApi, Sponsor, Configuration } from '../../client-axios'
import * as Styled from './styled'

export const Sponsors: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 5,
    autoplay: true,
    speed: 50000,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
  }

  const [data, setData] = useState<Sponsor[]>([])

  useEffect(() => {
    new SponsorApi(new Configuration({ basePath: window.location.origin }))
      .apiV1SponsorsGet('cndo2021')
      .then((res) => {
        setData(res.data)
      })
  }, [])

  return (
    <Styled.Outer>
      <Styled.Container>
        <Styled.CNDOSlider {...settings}>
          {data.map((sponsor) => (
            <Styled.Sponsor key={sponsor.id}>
              <a href={sponsor.url} target="_blank">
                <Styled.SponsorImg src={sponsor.logo_url} />
              </a>
            </Styled.Sponsor>
          ))}
        </Styled.CNDOSlider>
      </Styled.Container>
    </Styled.Outer>
  )
}
