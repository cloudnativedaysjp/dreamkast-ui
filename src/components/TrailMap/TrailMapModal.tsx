import React, { useState } from 'react'
import { Modal, Button } from '@material-ui/core'
import { StampCard } from './StampCard'

type Props = {
  todo?: boolean
}

export const TrailMapModal = (_: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Trail Map</Button>
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
