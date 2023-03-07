import React from 'react'
import * as Styled from './styled'
import { StampCard } from './internal/StampCard'
import { TrailMapPoint } from './internal/TrailMapPoint'
import { TrailMapRule } from './internal/TrailMapRule'
import { useStampCompleteBonus } from './hooks'
import { TrailMapPointHistory } from './internal/TrailMapPointHistory'

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
        <TrailMapPointHistory></TrailMapPointHistory>
      </Styled.InnerContainer>
    </Styled.Container>
  )
}
