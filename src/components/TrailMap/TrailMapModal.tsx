import React from 'react'
import { Modal } from '@material-ui/core'
import { StampCard } from './StampCard'
import { settingsSelector, setTrailMapOpen } from '../../store/settings'
import { useDispatch, useSelector } from 'react-redux'

type Props = {
  todo?: boolean
}

export const TrailMapModal = (_: Props) => {
  const settings = useSelector(settingsSelector)
  const dispatch = useDispatch()
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
