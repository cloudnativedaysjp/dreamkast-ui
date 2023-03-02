import React, { useEffect } from 'react'
import { settingsSelector, setTrailMapOpen } from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearTrailMapOpenNext,
  getTrailMapOpenNext,
} from '../../util/sessionstorage/trailMap'
import { TrailMap } from './TrailMap'
import * as Styled from './styled'

type Props = {
  todo?: boolean
}

export const TrailMapModal = (_: Props) => {
  const settings = useSelector(settingsSelector)
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
      open={settings.isTrailMapOpen}
      onClose={() => dispatch(setTrailMapOpen(false))}
    >
      <TrailMap></TrailMap>
    </Styled.TrailMapModal>
  )
}
