import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QuestionForm } from '../QuestionForm'

describe('QuestionForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders form correctly', () => {
    render(<QuestionForm isVisibleForm={true} onSubmit={mockOnSubmit} />)
    expect(screen.getByPlaceholderText('質問を入力してください')).toBeInTheDocument()
    expect(screen.getByText('質問を投稿')).toBeInTheDocument()
  })

  it('does not render when isVisibleForm is false', () => {
    render(<QuestionForm isVisibleForm={false} onSubmit={mockOnSubmit} />)
    expect(screen.queryByPlaceholderText('質問を入力してください')).not.toBeInTheDocument()
  })

  it('submits form with valid input', async () => {
    render(<QuestionForm isVisibleForm={true} onSubmit={mockOnSubmit} />)
    const textarea = screen.getByPlaceholderText('質問を入力してください')
    const submitButton = screen.getByText('質問を投稿')

    fireEvent.change(textarea, { target: { value: 'これは質問です' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('これは質問です')
    })
  })

  it('disables submit button when body is empty', () => {
    render(<QuestionForm isVisibleForm={true} onSubmit={mockOnSubmit} />)
    const submitButton = screen.getByText('質問を投稿')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when body has content', () => {
    render(<QuestionForm isVisibleForm={true} onSubmit={mockOnSubmit} />)
    const textarea = screen.getByPlaceholderText('質問を入力してください')
    const submitButton = screen.getByText('質問を投稿')

    fireEvent.change(textarea, { target: { value: '質問' } })

    expect(submitButton).not.toBeDisabled()
  })

  it('trims whitespace from input', async () => {
    render(<QuestionForm isVisibleForm={true} onSubmit={mockOnSubmit} />)
    const textarea = screen.getByPlaceholderText('質問を入力してください')
    const submitButton = screen.getByText('質問を投稿')

    fireEvent.change(textarea, { target: { value: '  質問  ' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('質問')
    })
  })

  it('shows character count', () => {
    render(<QuestionForm isVisibleForm={true} onSubmit={mockOnSubmit} />)
    const textarea = screen.getByPlaceholderText('質問を入力してください')

    fireEvent.change(textarea, { target: { value: '質問' } })

    expect(screen.getByText('2文字')).toBeInTheDocument()
  })
})
