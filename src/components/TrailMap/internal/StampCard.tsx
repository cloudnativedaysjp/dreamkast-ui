import React, { useEffect, useState } from 'react'
import * as Styled from '../styled'
import { useSelector } from 'react-redux'
import { appDataSelector, useStamps } from '../../../store/appData'
import { Skeleton } from '@material-ui/lab'
import { useAddStampIfSatisfied } from '../hooks'
import { DkUiData } from '../../../generated/dreamkast-api.generated'
import { stampLocation } from './const'
import { useImgPreload } from '../../common/PreloadedImg'

const imgStampBg = `/cicd2023/ui/stamp_bg.jpg`
const imgStamp = `/cicd2023/ui/cicd2023_stamp.png`

export const StampCard = () => {
  const { appDataInitialized } = useSelector(appDataSelector)
  const { stamps } = useStamps()
  const { addedNew, addedByQRCode } = useAddStampIfSatisfied()

  const [pinnedStamps, setPinnedStamps] = useState<
    DkUiData['stampChallenges'] | null
  >(null)

  useEffect(() => {
    if (!appDataInitialized) {
      return
    }
    if (pinnedStamps !== null) {
      return
    }
    setPinnedStamps(stamps)
  }, [stamps, pinnedStamps])

  useImgPreload(imgStampBg)
  useImgPreload(imgStamp)

  if (!pinnedStamps) {
    return (
      <Styled.StampCardContainer>
        <div className={'suspend'}>
          <Skeleton variant="rect" animation={'wave'} className={'skeleton'} />
        </div>
      </Styled.StampCardContainer>
    )
  }

  const showStampWithoutEffect = addedByQRCode
    ? (i: number) => i < pinnedStamps.length - 1
    : (i: number) => i < pinnedStamps.length

  const showStampWithEffect = addedByQRCode
    ? (i: number) => i === pinnedStamps.length - 1 && addedNew
    : (i: number) => i === pinnedStamps.length && addedNew

  return (
    <PStampCard
      showStampWithoutEffect={showStampWithoutEffect}
      showStampWithEffect={showStampWithEffect}
    ></PStampCard>
  )
}

type Props = {
  showStampWithoutEffect: (i: number) => boolean
  showStampWithEffect: (i: number) => boolean
}

export const PStampCard = ({
  showStampWithoutEffect,
  showStampWithEffect,
}: Props) => {
  return (
    <>
      <Styled.StampCardContainer>
        <Styled.StampCard src={imgStampBg}></Styled.StampCard>
        {stampLocation.map((loc, i) => (
          <Styled.StampFrame key={i} top={`${loc.top}%`} left={`${loc.left}%`}>
            {showStampWithoutEffect(i) && (
              <Styled.Stamp src={imgStamp}></Styled.Stamp>
            )}
            {showStampWithEffect(i) && (
              <Styled.Stamp
                className={'showAnimation'}
                src={imgStamp}
              ></Styled.Stamp>
            )}
          </Styled.StampFrame>
        ))}
      </Styled.StampCardContainer>
    </>
  )
}
