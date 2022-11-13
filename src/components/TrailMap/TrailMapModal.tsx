import React, { useState } from 'react'
import { Badge, Modal } from '@material-ui/core'
import { StampCard } from './StampCard'
import * as Styled from './styled'
import { stampSelector } from '../../store/settings'
import { useSelector } from 'react-redux'

type Props = {
  todo?: boolean
}

export const TrailMapModal = (_: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const stamp = useSelector(stampSelector)
  return (
    <>
      <Badge
        badgeContent={'!'}
        color="secondary"
        invisible={!stamp.canGetNewStamp}
      >
        <Styled.TrailMapButton
          onClick={() => setOpen(true)}
          className={stamp.canGetNewStamp ? 'pulse' : ''}
        >
          Trail Map
        </Styled.TrailMapButton>
      </Badge>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/*TODO*/}
        <StampCard></StampCard>
      </Modal>
    </>
  )
}
