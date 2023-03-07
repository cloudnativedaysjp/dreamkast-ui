import React, { useEffect, useState } from 'react'
import * as Styled from '../styled'
import { useSelector } from 'react-redux'
import { appDataSelector, useStamps } from '../../../store/appData'
import { Skeleton } from '@material-ui/lab'
import { useAddStampIfSatisfied } from '../hooks'
import { DkUiData } from '../../../generated/dreamkast-api.generated'

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
        <Styled.StampCard src={`/cndt2022/ui/stamp_bg.jpg`}></Styled.StampCard>
        {stampLocation.map((loc, i) => (
          <Styled.StampFrame top={`${loc.top}%`} left={`${loc.left}%`}>
            {showStampWithoutEffect(i) && (
              <Styled.Stamp
                src={`/cndt2022/ui/cndt2022_stamp.png`}
              ></Styled.Stamp>
            )}
            {showStampWithEffect(i) && (
              <Styled.Stamp
                className={'showAnimation'}
                src={`/cndt2022/ui/cndt2022_stamp.png`}
              ></Styled.Stamp>
            )}
          </Styled.StampFrame>
        ))}
      </Styled.StampCardContainer>
    </>
  )
}

const stampLocation = [
  {
    top: 32,
    left: 7,
  },
  {
    top: 32,
    left: 22,
  },
  {
    top: 32,
    left: 37,
  },
  {
    top: 32,
    left: 52,
  },
  {
    top: 32,
    left: 67,
  },
  {
    top: 32,
    left: 82,
  },

  {
    top: 70,
    left: 7,
  },
  {
    top: 70,
    left: 22,
  },
  {
    top: 70,
    left: 37,
  },
  {
    top: 70,
    left: 52,
  },
  {
    top: 70,
    left: 67,
  },
  {
    top: 70,
    left: 82,
  },
]
