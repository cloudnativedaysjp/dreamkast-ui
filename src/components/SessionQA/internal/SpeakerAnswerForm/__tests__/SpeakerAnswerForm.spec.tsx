import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SpeakerAnswerForm } from '../SpeakerAnswerForm'

describe('SpeakerAnswerForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
    mockOnCancel.mockClear()
  })

  it('renders form correctly', () => {
    render(<SpeakerAnswerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    expect(screen.getByPlaceholderText('回答を入力してください')).toBeInTheDocument()
    expect(screen.getByText('回答する')).toBeInTheDocument()
    expect(screen.getByText('キャンセル')).toBeInTheDocument()
  })

  it('submits form with valid input', async () => {
    render(<SpeakerAnswerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    const textarea = screen.getByPlaceholderText('回答を入力してください')
    const submitButton = screen.getByText('回答する')

    fireEvent.change(textarea, { target: { value: 'これは回答です' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('これは回答です')
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<SpeakerAnswerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    const cancelButton = screen.getByText('キャンセル')

    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('disables submit button when body is empty', () => {
    render(<SpeakerAnswerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    const submitButton = screen.getByText('回答する')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when body has content', () => {
    render(<SpeakerAnswerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    const textarea = screen.getByPlaceholderText('回答を入力してください')
    const submitButton = screen.getByText('回答する')

    fireEvent.change(textarea, { target: { value: '回答' } })

    expect(submitButton).not.toBeDisabled()
  })

  it('shows character count', () => {
    render(<SpeakerAnswerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    const textarea = screen.getByPlaceholderText('回答を入力してください')

    fireEvent.change(textarea, { target: { value: '回答' } })

    expect(screen.getByText('2文字')).toBeInTheDocument()
  })
})
