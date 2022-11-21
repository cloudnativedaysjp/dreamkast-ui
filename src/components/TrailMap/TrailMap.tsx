import React from 'react'
import * as Styled from './styled'
import { StampCard } from './StampCard'
import { TrailMapPoint } from './TrailMapPoint'
import { TrailMapRule } from './TrailMapRule'
import { useStampCompleteBonus } from '../hooks/useStampCompleteBonus'

export const TrailMap = () => {
  useStampCompleteBonus()

  return (
    <Styled.Container>
      <Styled.InnerContainer>
        <Styled.TrailMapHeader
          src={`/cndt2022/ui/trailmap_header.jpg`}
        ></Styled.TrailMapHeader>
        <TrailMapPoint></TrailMapPoint>
        <StampCard></StampCard>
        <TrailMapRule></TrailMapRule>
      </Styled.InnerContainer>
    </Styled.Container>
  )
}
