import * as Styled from '../components/Layout/styled'

const Error404 = () => {
  return (
    <Styled.ErrorMessage>
      404 Not Found
      <br />
      ページが存在しません。URLをご確認ください。
    </Styled.ErrorMessage>
  )
}

export default Error404
