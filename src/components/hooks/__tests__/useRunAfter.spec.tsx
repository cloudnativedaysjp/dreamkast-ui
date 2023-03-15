import React, { useEffect, useState } from 'react'
import { useRunAfter } from '../useRunAfter'
import { render } from '@testing-library/react'

describe('useRunAfter', () => {
  it('should run callback after specified delay and skip calls in the middle', async () => {
    const fn = jest.fn()
    let trials = 0
    const Test = () => {
      const { run } = useRunAfter(fn, 30)
      const [tick, setTick] = useState<number>(0)
      useEffect(() => {
        setTimeout(() => setTick(tick + 1), 10)
      }, [tick])
      useEffect(() => {
        trials++
        run()
      }, [tick])
      return tick > 8 ? <div data-testid={'tgt'} /> : <div></div>
    }

    const screen = render(<Test />)
    await screen.findByTestId('tgt')

    expect(trials).toBeGreaterThan(8)
    expect(fn.mock.calls.length).toBeGreaterThan(1)
    expect(fn.mock.calls.length).toBeLessThan(4)
  })
})
