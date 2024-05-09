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
  const storedKeysRef = React.useRef(storedKeys)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    storedKeysRef.current = storedKeys
  }, [storedKeys])
  useEffect(() => {
    for (const key in localStorage) {
      if (key.startsWith('check_in_')) {
        setStoredKeys((prev) => (prev.includes(key) ? prev : [...prev, key]))
      }
    }

    const interval = setInterval(() => {
      console.log('Send check-in logs to dreamkast api:')
      console.log(storedKeys)

      for (const key of storedKeysRef.current) {
        console.log(
          `Success to send check-in log: key:L ${key}, value: ${JSON.stringify(
            localStorage.getItem(key),
          )}`,
        )
        deleteItem(key)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkInConference = () => {
    const uuid = uuid4()
    const key = `check_in_${uuid}`
    const value = {
      checkInType: checkInType,
      profileId: 2,
      checkInTimestamp: Math.floor(Date.now() / 1000),
    }
    localStorage.setItem(key, JSON.stringify(value))
    setStoredKeys((prev) => [...prev, key])
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteItem = (key: string) => {
    localStorage.removeItem(key)
    setStoredKeys(storedKeys.filter((k) => k !== key))
  }

  return (
    <div>
      {/*<Camera height={100} width={100} />*/}
      <DummyCamera />
      <DummyCheckInButton onClick={checkInConference} />
      <ConfirmDialog open={open} handleClose={handleClose} />
      <Typography variant="h5">↓Debug↓</Typography>
      <Debug storedKeys={storedKeys} deleteItem={deleteItem} />
    </div>
  )
}
