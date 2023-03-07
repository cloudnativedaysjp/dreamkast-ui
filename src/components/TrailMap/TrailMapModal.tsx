import React, { PropsWithChildren, ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pointsSelector, setTrailMapOpen } from '../../store/points'
import {
  clearTrailMapOpenNext,
  getTrailMapOpenNext,
} from '../../util/sessionstorage/trailMap'
import * as Styled from './styled'

export const TrailMapModal = ({ children }: PropsWithChildren) => {
  const points = useSelector(pointsSelector)
  const dispatch = useDispatch()

  // get stamp by offline user via QR code
  useEffect(() => {
    if (getTrailMapOpenNext()) {
      clearTrailMapOpenNext()
      dispatch(setTrailMapOpen(true))
    }
  }, [])

  return (
    <Styled.TrailMapModal
      open={points.isTrailMapOpen}
      onClose={() => dispatch(setTrailMapOpen(false))}
    >
      {children as ReactElement}
    </Styled.TrailMapModal>
  )
}
