import React from 'react'
import * as Styled from './styled'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../store/settings'

export const TrailMapPoint = () => {
  const settings = useSelector(settingsSelector)
  if (!settings.pointDataInitialized) {
    return <></>
  }

  const { total } = settings.pointData
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
    <div>
      <Styled.TrailMapPointContainer>
        {trailingImage}
        <div className={'ticket'}>抽選券 {ticket} 枚ゲット！</div>
        <div className={'point'}>
          {ticket > 0 ? ticket * 100 : ''} + {frac}pt
        </div>
      </Styled.TrailMapPointContainer>
    </div>
  )
}
