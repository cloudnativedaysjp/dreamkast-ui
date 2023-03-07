import React from 'react'
import { PStampCard } from '../StampCard'
import { render } from '@testing-library/react'

describe('PStampCard', () => {
  it('should render without crash', () => {
    const screen = render(
      <PStampCard
        showStampWithoutEffect={(i) => [0, 1, 2, 6, 7, 8].includes(i)}
        showStampWithEffect={(i) => i === 9}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
  it('should render when not stamped at all', () => {
    const screen = render(
      <PStampCard
        showStampWithoutEffect={() => false}
        showStampWithEffect={() => false}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
  it('should render when all stamped', () => {
    const screen = render(
      <PStampCard
        showStampWithoutEffect={() => true}
        showStampWithEffect={() => false}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
})
