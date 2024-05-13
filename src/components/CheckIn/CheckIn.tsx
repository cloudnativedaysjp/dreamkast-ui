import React, { useEffect, useState } from 'react'
import { uuid4 } from '@sentry/utils'
import { ConfirmDialog } from './internal/ConfirmDialog'
import { DummyCheckInButton } from './internal/DummyCheckInButton/DummyCheckInButton'
import { Debug } from './internal/Debug/Debug'
import { DummyCamera } from './internal/DummyCamera'
import { Typography } from '@material-ui/core'

type CheckInType = 'event' | 'session'

type Props = {
  checkInType: CheckInType
}

export const CheckIn: React.FC<Props> = ({ checkInType }) => {
  const [storedKeys, setStoredKeys] = React.useState<string[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('check_in_'),
    )
    setStoredKeys(keys)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Send check-in logs to dreamkast api:')
      deleteItems(storedKeys)
    }, 10000)
    return () => clearInterval(interval)
  }, [storedKeys])

  const randomInt = (): number => {
    const minCeil = Math.ceil(0)
    const maxFloor = Math.floor(100)
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil
  }
  const checkInConference = () => {
    const uuid = uuid4()
    const key = `check_in_${uuid}`
    const value = {
      checkInType: checkInType,
      profileId: randomInt(),
      checkInTimestamp: Math.floor(Date.now() / 1000),
    }
    localStorage.setItem(key, JSON.stringify(value))
    setStoredKeys((prev) => [...prev, key])
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteItems = (keys: string[]) => {
    console.log(keys)
    for (const key of keys) {
      console.log(
        `Success to send check-in log: key:L ${key}, value: ${JSON.stringify(
          localStorage.getItem(key),
        )}`,
      )
      localStorage.removeItem(key)
    }
    setStoredKeys(storedKeys.filter((k) => !keys.includes(k)))
  }

  return (
    <div>
      {/*<Camera height={100} width={100} />*/}
      <DummyCamera />
      <DummyCheckInButton onClick={checkInConference} />
      <ConfirmDialog open={open} handleClose={handleClose} />
      <Typography variant="h5">↓Debug↓</Typography>
      <Debug storedKeys={storedKeys} deleteItems={deleteItems} />
    </div>
  )
}
