import React, { useState } from 'react'
import { Modal, Button } from '@material-ui/core'
import * as Styled from './styled'

type Props = {
  todo?: boolean
}

export const StampModal = (_: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  // const settings = useSelector(settingsSelector)

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
        <Styled.Container>
          <Styled.TrailMapImg
            src={`/cndt2022/ui/trailmap.jpg`}
          ></Styled.TrailMapImg>
          <Styled.StampFrame top={'4%'} left={'27%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'10%'} left={'57%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'23%'} left={'27%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'29%'} left={'57%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'42%'} left={'27%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'48%'} left={'57%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'61%'} left={'27%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'67%'} left={'57%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'80%'} left={'27%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
          <Styled.StampFrame top={'86%'} left={'57%'}>
            <Styled.Stamp
              src={`/cndt2022/ui/cndt2022_trademark.png`}
            ></Styled.Stamp>
          </Styled.StampFrame>
        </Styled.Container>
      </Modal>
    </>
  )
}
