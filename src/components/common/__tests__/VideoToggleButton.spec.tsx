import React from 'react'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import { VideoToggleButton } from '../VideoToggleButton'
import { fireEvent } from '@testing-library/react'

describe('VideoToggleButton', () => {
  it('should be rendered', () => {
    const store = setupStore()
    renderWithProviders(<VideoToggleButton />, { store })
  })

  it('changes showVideo status when clicked', async () => {
    const store = setupStore()
    const prev = store.getState().settings.showVideo
    expect(prev).toBeFalsy()

    const screen = renderWithProviders(<VideoToggleButton />, { store })
    fireEvent.click(await screen.findByTestId('toggle-btn'))
    expect(screen.store.getState().settings.showVideo).toBeTruthy()

    fireEvent.click(await screen.findByTestId('toggle-btn'))
    expect(screen.store.getState().settings.showVideo).toBeFalsy()
  })
})
