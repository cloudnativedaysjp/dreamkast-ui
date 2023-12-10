import React from 'react'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import {
  Event,
  useGetApiV1SponsorsQuery,
} from '../../generated/dreamkast-api.generated'

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

  const { data, isLoading } = useGetApiV1SponsorsQuery({
    eventAbbr: event.abbr,
  })
  if (isLoading || !data) {
    return <div />
  }

  return (
    <CommonStyled.Container>
      <Styled.CNDOSlider {...settings}>
        {data.map((sponsor) => (
          <Styled.Sponsor key={sponsor.id}>
            <a href={sponsor.url} target="_blank">
              <Styled.SponsorImgContainer>
                <Styled.SponsorImg src={sponsor.logo_url} />
              </Styled.SponsorImgContainer>
            </a>
          </Styled.Sponsor>
        ))}
      </Styled.CNDOSlider>
    </CommonStyled.Container>
  )
}
