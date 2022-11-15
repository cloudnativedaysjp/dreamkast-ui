import React, { useEffect } from 'react'
import { Modal } from '@material-ui/core'
import { StampCard } from './StampCard'
import { settingsSelector, setTrailMapOpen } from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearTrailMapOpenNext,
  getTrailMapOpenNext,
} from '../../util/stampCollecting'

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
    <Modal
      open={settings.isTrailMapOpen}
      onClose={() => dispatch(setTrailMapOpen(false))}
    >
      {/*TODO*/}
      <StampCard></StampCard>
    </Modal>
  )
}
