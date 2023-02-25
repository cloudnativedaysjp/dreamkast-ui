import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { LiveTalkModalButton } from '../LiveTalkModalButton'

describe('LiveTalkModalButton', () => {
  it('does not render modal by default', () => {
    const screen = render(
      <LiveTalkModalButton
        content={(closeModal) => (
          <div data-testid={'tgt'} onClick={() => closeModal()} />
        )}
      ></LiveTalkModalButton>,
    )
    expect(screen.queryByTestId('tgt')).toBeNull()
  })

  it('renders modal when button clicked', () => {
    const screen = render(
      <LiveTalkModalButton
        content={(closeModal) => (
          <div data-testid={'tgt'} onClick={() => closeModal()} />
        )}
      ></LiveTalkModalButton>,
    )
    fireEvent.click(screen.getByTestId('btn'))
    expect(screen.queryByTestId('tgt')).toBeTruthy()
  })

  it('hides modal when closeModal called', () => {
    const screen = render(
      <LiveTalkModalButton
        content={(closeModal) => (
          <div data-testid={'tgt'} onClick={() => closeModal()} />
        )}
      ></LiveTalkModalButton>,
    )
    fireEvent.click(screen.getByTestId('btn'))
    expect(screen.queryByTestId('tgt')).toBeTruthy()

    fireEvent.click(screen.getByTestId('tgt'))
    expect(screen.queryByTestId('tgt')).toBeNull()
  })
})
