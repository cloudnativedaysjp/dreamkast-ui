import React from 'react'
import * as Styled from '../styled'
import { Skeleton } from '@material-ui/lab'
import { ProfilePointsResponse } from '../../../generated/dreamkast-api.generated'

type Props = {
  isLoading: boolean
  pointData: ProfilePointsResponse
}

export const TrailMapPoint = ({ isLoading, pointData }: Props) => {
  if (isLoading) {
    return (
      <Styled.TrailMapPointSuspendContainer>
        <div className={'suspend'}>
          <Skeleton variant="rect" animation={'wave'} className={'skeleton'} />
        </div>
      </Styled.TrailMapPointSuspendContainer>
    )
  }

  const { total } = pointData
  const ticket = Math.floor(total / 100)
  const frac = total % 100

  const trailingImage = (() => {
    if (frac < 20) {
      return (
        <img src={'/cndt2022/ui/trailmap_0.jpg'} alt={'Trail Mapの出発地点'} />
      )
    }
    if (frac < 40) {
      return (
        <img src={'/cndt2022/ui/trailmap_25.jpg'} alt={'Trail Mapの3合目'} />
      )
    }
    if (frac < 60) {
      return (
        <img src={'/cndt2022/ui/trailmap_50.jpg'} alt={'Trail Mapの5合目'} />
      )
    }
    if (frac < 80) {
      return (
        <img src={'/cndt2022/ui/trailmap_75.jpg'} alt={'Trail Mapの8合目'} />
      )
    }
    if (frac < 100) {
      return (
        <img
          src={'/cndt2022/ui/trailmap_100.jpg'}
          alt={'Trail Mapの山頂付近'}
        />
      )
    }
  })()

  return (
    <Styled.TrailMapPointContainer>
      {trailingImage}
      {ticket > 0 ? (
        <div className={'ticket'}>抽選券 {ticket} 枚ゲット！</div>
      ) : (
        ''
      )}
      <div className={'point'}>
        {ticket > 0 ? `${ticket * 100} + ` : ''}
        {frac}pt
      </div>
    </Styled.TrailMapPointContainer>
  )
}
