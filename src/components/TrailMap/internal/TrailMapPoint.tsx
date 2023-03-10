import React from 'react'
import * as Styled from '../styled'
import { ProfilePointsResponse } from '../../../generated/dreamkast-api.generated'
import { PreloadedImg } from '../../common/PreloadedImg'
import { Skeleton } from '@material-ui/lab'

type Props = {
  isLoading?: boolean
  pointData: ProfilePointsResponse
}

const ImgSkeleton = () => {
  return (
    <Styled.TrailMapPointSuspendContainer>
      <div className={'suspend'}>
        <Skeleton variant="rect" animation={'wave'} className={'skeleton'} />
      </div>
    </Styled.TrailMapPointSuspendContainer>
  )
}

export const TrailMapPoint = ({ isLoading, pointData }: Props) => {
  const img0 = PreloadedImg({
    src: '/cicd2023/ui/trailmap_0.jpg',
    alt: 'Trail Mapの出発地点',
    suspence: <ImgSkeleton />,
  })
  const img25 = PreloadedImg({
    src: '/cicd2023/ui/trailmap_25.jpg',
    alt: 'Trail Mapの3合目',
    suspence: <ImgSkeleton />,
  })
  const img50 = PreloadedImg({
    src: '/cicd2023/ui/trailmap_50.jpg',
    alt: 'Trail Mapの5合目',
    suspence: <ImgSkeleton />,
  })
  const img75 = PreloadedImg({
    src: '/cicd2023/ui/trailmap_75.jpg',
    alt: 'Trail Mapの8合目',
    suspence: <ImgSkeleton />,
  })
  const img100 = PreloadedImg({
    src: '/cicd2023/ui/trailmap_100.jpg',
    alt: 'Trail Mapの山頂付近',
    suspence: <ImgSkeleton />,
  })

  if (isLoading) {
    return <ImgSkeleton />
  }

  const { total } = pointData
  const ticket = Math.floor(total / 100)
  const frac = total % 100
  const trailingImage = (() => {
    if (frac < 20) {
      return img0
    }
    if (frac < 40) {
      return img25
    }
    if (frac < 60) {
      return img50
    }
    if (frac < 80) {
      return img75
    }
    if (frac < 100) {
      return img100
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
