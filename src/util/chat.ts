import { ChatMessage } from '../generated/dreamkast-api.generated'

export class ChatMessageMap extends Map<number, ChatMessageContainer> {
  addMessage = (msg: ChatMessageContainer): void => {
    if (!msg.id) return

    if (msg.replyTo) {
      const parent = this.get(msg.replyTo)
      if (parent) {
        if (!parent.children) {
          parent.children = new Map<number, ChatMessageContainer>()
        }
        parent.children.set(msg.id, msg)
      } else {
        this.set(msg.id, msg)
      }
    } else {
      this.set(msg.id, msg)
    }
  }
}

export type ChatMessageContainer = ChatMessage & {
  children?: Map<number, ChatMessageContainer>
}
