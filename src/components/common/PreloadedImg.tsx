import React, { ReactElement, useEffect, useState } from 'react'

type Props = {
  src: string
  alt?: string
  suspence: ReactElement
  [_: string]: unknown
}

export const useImgPreload = (src: string) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setLoading(false)
    }
  }, [])

  return {
    loading,
  }
}

export function PreloadedImg({ src, alt, suspence, ...rest }: Props) {
  const { loading } = useImgPreload(src)
  if (loading) {
    return suspence
  }
  return <img src={src} alt={alt} {...rest} />
}
