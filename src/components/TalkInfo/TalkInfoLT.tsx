import React from 'react'
import * as Styled from './styled'

type Props = {
  eventAbbr: string
  title: string
  content: string
}

export const TalkInfoLT: React.FC<Props> = ({ eventAbbr, title, content }) => {
  const xURL = `http://x.com/share?url=https://event.cloudnativedays.jp/${eventAbbr}&related=@cloudnativedays&hashtags=${eventAbbr}`
  return (
    <Styled.Container>
      <Styled.Title>{title}</Styled.Title>
      <Styled.Content>{content}</Styled.Content>
      <Styled.SocialHeader>
        <Styled.TalkIcon src={`/${eventAbbr}/ui/talk_icon.png`} />
        一緒に盛り上がろう
      </Styled.SocialHeader>
      <Styled.ButtonContainer>
        <Styled.ButtonLink href={xURL} target="_blank">
          <Styled.XPostButton>
            <Styled.XImg src={`/${eventAbbr}/ui/x_logo.png`} />
            {`ポスト #${eventAbbr}`}
          </Styled.XPostButton>
        </Styled.ButtonLink>
      </Styled.ButtonContainer>
    </Styled.Container>
  )
}
