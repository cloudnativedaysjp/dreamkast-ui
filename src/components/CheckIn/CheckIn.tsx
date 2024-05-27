import React, { useEffect, useState } from 'react'
import { uuid4 } from '@sentry/utils'
import { ConfirmDialog } from './internal/ConfirmDialog'
import { DummyCheckInButton } from './internal/DummyCheckInButton/DummyCheckInButton'
import { Debug } from './internal/Debug/Debug'
import { Camera } from './internal/Camera'
import {
  Talk,
  usePostApiV1CheckInEventsMutation,
  usePostApiV1CheckInTalksMutation,
} from '../../generated/dreamkast-api.generated'

export type CheckInType = 'event' | 'session'

type Props = {
  checkInType: CheckInType
  eventAbbr: string
  talk?: Talk
  debug?: boolean
}

type CheckInData = {
  checkInType: CheckInType
  eventAbbr: string
  profileId: string
  checkInTimestamp: number
  talkId?: string
}

export const CheckIn: React.FC<Props> = ({
  checkInType,
  eventAbbr,
  talk,
  debug,
}) => {
  const [storedKeys, setStoredKeys] = React.useState<string[]>([])
  const [open, setOpen] = useState(false)
  const storedKeysRef = React.useRef(storedKeys)
  const [enableScan, setEnableScan] = useState(true)
  const [checkInEvent] = usePostApiV1CheckInEventsMutation()
  const [checkInSession] = usePostApiV1CheckInTalksMutation()

  useEffect(() => {
    storedKeysRef.current = storedKeys
  }, [storedKeys])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Send check-in logs to dreamkast api:')
      console.log(storedKeys)

      for (const key of storedKeysRef.current) {
        console.log(
          `Success to send check-in log: key:L ${key}, value: ${JSON.stringify(
            localStorage.getItem(key),
          )}`,
        )
        const item = JSON.parse(localStorage.getItem(key))
        if (!debug) {
          if (item['checkInType'] === 'event') {
            checkInEvent({
              checkInEvent: {
                profileId: item['profileId'],
                eventAbbr: item['eventAbbr'],
                checkInTimestamp: item['checkInTimestamp'],
              },
            }).unwrap()
          } else if (item['checkInType'] === 'session') {
            checkInSession({
              checkInTalk: {
                profileId: item['profileId'],
                eventAbbr: item['eventAbbr'],
                talkId: item['talkId'],
                checkInTimestamp: item['checkInTimestamp'],
              },
            }).unwrap()
          } else {
            console.error(`Invalid check-in type: ${item['checkInType']}`)
          }
        }

        deleteItem(key)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [storedKeys])

  const setCheckInDataToLocalStorage = (profileId: string) => {
    setEnableScan(false)
    setOpen(true)
    ;(async () => {
      for (const key of storedKeysRef.current) {
        const item = JSON.parse(localStorage.getItem(key))
        if (item['profileId'] == profileId) {
          console.log('Already checked in')
          return // already checked in
        }
      }
      const uuid = uuid4()
      const key = `check_in_${uuid}`
      const value: CheckInData = {
        checkInType: checkInType,
        eventAbbr: eventAbbr,
        profileId: profileId,
        checkInTimestamp: Math.floor(Date.now() / 1000),
      }
      if (checkInType === 'session') {
        value.talkId = talk?.id.toString()
      }
      localStorage.setItem(key, JSON.stringify(value))
      setStoredKeys((prev) => [...prev, key])
    })()
  }

  // const dummyCheckInConference = () => {
  //   setCheckInDataToLocalStorage('2')
  // }

  const handleClose = () => {
    setOpen(false)
    setEnableScan(true)
  }

  const deleteItem = (key: string) => {
    localStorage.removeItem(key)
    setStoredKeys(storedKeys.filter((k) => k !== key))
  }

  return (
    <div>
      <Camera
        height={100}
        width={100}
        setCheckInDataToLocalStorage={setCheckInDataToLocalStorage}
        enableScan={enableScan}
      />
      <ConfirmDialog open={open} handleClose={handleClose} />
      <Debug storedKeys={storedKeys} deleteItem={deleteItem} />
    </div>
  )
}
