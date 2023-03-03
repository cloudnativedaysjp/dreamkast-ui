import React, { ReactElement } from 'react'

export type ContainerComponent<T> = React.FC<{
  content: (props: T) => ReactElement
}>
