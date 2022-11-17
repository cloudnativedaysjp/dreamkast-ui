import React from 'react'
import * as Styled from './styled'
import { StampCard } from './StampCard'
import { TrailMapPoint } from './TrailMapPoint'
import { TrailMapRule } from './TrailMapRule'

export const TrailMap = () => {
  return (
    <Styled.Container>
      <Styled.TrailMapHeader
        src={`/cndt2022/ui/trailmap_header.jpg`}
      ></Styled.TrailMapHeader>
      <TrailMapPoint></TrailMapPoint>
      <StampCard></StampCard>
      <TrailMapRule></TrailMapRule>
    </Styled.Container>
  )
}
