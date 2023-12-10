import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const CNDOSlider = styled(Slider)``

export const Sponsor = styled.div`
  position: relative;
  height: 45px;
`

export const SponsorImgContainer = styled.div`
  height: 40px;
  width: 100%;
  position: absolute;
  top: 10px;
  display: flex;
`

export const SponsorImg = styled.img`
  max-width: 150px;
  max-height: 40px;
  margin: auto;
  align-items: center;
`
