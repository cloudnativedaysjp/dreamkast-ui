import styled from 'styled-components'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const CNDOSlider = styled(Slider)``

export const Outer = styled.div`
  padding: 15px 0 0 0;
`

export const Container = styled.div`
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 0px 5px 0px;
`

export const Sponsor = styled.div`
  position: relative;
  height: 40px;
`

export const SponsorImg = styled.img`
  max-width: 150px;
  max-height: 40px;
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
