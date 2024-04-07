import React from 'react'
import { Button } from '@material-ui/core'

type Props = {
  onClick: () => void
}

export const DummyCheckInButton: React.FC<Props> = ({onClick}) => {
  return (
    <Button type="submit" onClick={onClick} variant="contained">
      イベントチェックイン用のダミーボタン
    </Button>
  )
}
