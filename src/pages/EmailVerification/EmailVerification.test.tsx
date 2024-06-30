import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithClient } from '@/__test__/utils'
import EmailVerification from './EmailVerification'

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
}))
const mockSetIsEmailVerifiedDialogOpen = jest.fn()

const Component = (isOpen: any) => (
  <EmailVerification
    isEmailVerifiedDialogOpen={isOpen}
    setIsEmailVerifiedDialogOpen={mockSetIsEmailVerifiedDialogOpen}
  />
)

describe('EmailVerification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Button should be in the DOM', () => {
    const result1 = renderWithClient(<Component isOpen={true} />)
    const remindMeButton = result1.getByRole('button', { name: 'Remind me later' })
    expect(remindMeButton).toBeInTheDocument()

    const result2 = renderWithClient(<Component isOpen={true} />)
    const verifyButton = result2.getByRole('button', { name: 'Verify' })
    expect(verifyButton).toBeInTheDocument()
  })

  it('should call handleRemindMeLater function when Remind me later button is clicked', async () => {
    const { getByText } = renderWithClient(<Component isOpen={true} />)

    const remindMeLaterButton = getByText('Remind me later')
    expect(remindMeLaterButton).toBeInTheDocument()
    fireEvent.click(remindMeLaterButton)

    await waitFor(() => {
      expect(mockSetIsEmailVerifiedDialogOpen).toHaveBeenCalledTimes(1)
    })
  })
})
