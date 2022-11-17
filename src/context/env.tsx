import React, { createContext, PropsWithChildren, useCallback } from 'react'
import { ENV } from '../config'
import { createHash } from 'crypto'

interface EnvCtxType {
  // TODO add other env vars if needed
  getPointEventId: (eventNum: number) => string
}

export const EnvCtx = createContext<EnvCtxType>({
  getPointEventId: () => '',
})

type Props = {
  env: typeof ENV
}

export const EnvProvider = (props: PropsWithChildren<Props>) => {
  const getPointEventId = useCallback((eventNum: number): string => {
    const salt = props.env.NEXT_PUBLIC_EVENT_SALT
    const shasum = createHash('sha1')
    return shasum.update(`${salt}/${eventNum}`).digest('hex')
  }, [])

  const ctx: EnvCtxType = {
    getPointEventId,
  }

  return <EnvCtx.Provider value={ctx}>{props.children}</EnvCtx.Provider>
}
