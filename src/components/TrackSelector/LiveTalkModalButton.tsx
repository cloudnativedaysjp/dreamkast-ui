import React, { ReactElement, useState } from 'react'
import * as Styled from './styled'
import { FormatListBulleted } from '@material-ui/icons'

type Props = {
  content: (closeModal: () => void) => ReactElement
}

export const LiveTalkModalButton: React.FC<Props> = ({ content }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      <Styled.LiveTalkModalButton
        data-testid="btn"
        color="primary"
        onClick={() => setModalOpen(true)}
      >
        <FormatListBulleted />
      </Styled.LiveTalkModalButton>
      <Styled.LiveTalkModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        {content(() => setModalOpen(false))}
      </Styled.LiveTalkModal>
    </>
  )
}
