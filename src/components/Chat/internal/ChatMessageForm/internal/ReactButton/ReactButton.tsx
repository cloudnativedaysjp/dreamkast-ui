import React from 'react'
import * as Styled from './styled'
import { ChatMessageApi, Configuration } from '../../../../../../client-axios'
import { ChatMessageRequest } from '../../../ChatMessageRequest'

type Props = {
  reactEmoji: string
  roomId?: number
}

export const ReactButton: React.FC<Props> = ({ reactEmoji, roomId }) => {
  const onClick = () => {
    if (!roomId) return
    const api = new ChatMessageApi(
      new Configuration({ basePath: window.location.origin }),
    )
    api.apiV1ChatMessagesPost(
      ChatMessageRequest('cndo2021', roomId, 'talk', reactEmoji, null),
    )
  }

  return (
    <Styled.ReactButton onClick={onClick} variant="contained">
      {reactEmoji}
    </Styled.ReactButton>
  )
}
