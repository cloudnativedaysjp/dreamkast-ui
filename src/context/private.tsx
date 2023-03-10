import React, { createContext, PropsWithChildren, useCallback } from 'react'
import { ENV } from '../config'
import { createHash } from 'crypto'

interface PrivateCtxType {
  // TODO add other env vars if needed
  getPointEventId: (eventNum: number) => string
  env: typeof ENV
}

export const PrivateCtx = createContext<PrivateCtxType>({
  getPointEventId: () => '',
  env: {} as typeof ENV,
})

type Props = {
  env: typeof ENV
}

export const PrivateCtxProvider = (props: PropsWithChildren<Props>) => {
  const getPointEventId = useCallback((eventNum: number): string => {
    const salt = props.env.NEXT_PUBLIC_EVENT_SALT
    const shasum = createHash('sha1')
    return shasum.update(`${salt}/${eventNum}`).digest('hex')
  }, [])

  const ctx: PrivateCtxType = {
    getPointEventId,
    env: props.env,
  }

  return <PrivateCtx.Provider value={ctx}>{props.children}</PrivateCtx.Provider>
}
