import React from 'react'
import * as Styled from './styled'
import { StampCard } from './internal/StampCard'
import { TrailMapPoint } from './internal/TrailMapPoint'
import { TrailMapRule } from './internal/TrailMapRule'
import { useStampCompleteBonus } from './hooks'
import { TrailMapPointHistory } from './internal/TrailMapPointHistory'
import { useSelector } from 'react-redux'
import { appDataSelector } from '../../store/appData'

export const TrailMap = () => {
  useStampCompleteBonus()
  const { pointDataInitialized, pointData } = useSelector(appDataSelector)

  return (
    <Styled.Container>
      <Styled.InnerContainer>
        <Styled.TrailMapHeader
          src={`/cicd2023/ui/trailmap_header.jpg`}
        ></Styled.TrailMapHeader>
        <TrailMapPoint
          isLoading={!pointDataInitialized}
          pointData={pointData}
        ></TrailMapPoint>
        <StampCard></StampCard>
        <TrailMapRule></TrailMapRule>
        <TrailMapPointHistory pointData={pointData}></TrailMapPointHistory>
      </Styled.InnerContainer>
    </Styled.Container>
  )
}
