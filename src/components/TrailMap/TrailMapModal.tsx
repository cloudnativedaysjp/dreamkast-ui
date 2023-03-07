import React, { PropsWithChildren, ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { appDataSelector, setTrailMapOpen } from '../../store/appData'
import {
  clearTrailMapOpenNext,
  getTrailMapOpenNext,
} from '../../util/sessionstorage/trailMap'
import * as Styled from './styled'

export const TrailMapModal = ({ children }: PropsWithChildren) => {
  const points = useSelector(appDataSelector)
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
