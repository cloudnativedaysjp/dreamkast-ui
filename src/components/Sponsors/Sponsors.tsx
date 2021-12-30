import React, { useState, useEffect } from 'react'
import { SponsorApi, Sponsor, Configuration, Event } from '../../client-axios'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  event: Event
}

export const Sponsors: React.FC<Props> = ({ event }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesPerRow: 3,
    slidesToScroll: 1,
    vertical: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 8000,
    cssEase: 'linear',
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesPerRow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesPerRow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const [data, setData] = useState<Sponsor[]>([])

  useEffect(() => {
    new SponsorApi(new Configuration({ basePath: window.location.origin }))
      .apiV1SponsorsGet(event.abbr)
      .then((res) => {
        setData(res.data)
      })
  }, [])

  return (
    <CommonStyled.Container>
      <Styled.CNDOSlider {...settings}>
        {data.map((sponsor) => (
          <Styled.Sponsor key={sponsor.id}>
            <a href={sponsor.url} target="_blank">
              <Styled.SponsorImg src={sponsor.logo_url} />
            </a>
          </Styled.Sponsor>
        ))}
      </Styled.CNDOSlider>
    </CommonStyled.Container>
  )
}
