/* eslint-disable testing-library/no-node-access */
import Signup from '../../pages/Signup/Signup'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { useSignUp } from '../../utils/hooks/useSignUpUser'

jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn(),
    create:jest.fn(),
    interceptors: {
        request: {
          use: jest.fn(),
          eject: jest.fn(),
        },
        response: {
            use: jest.fn(),
            eject: jest.fn(),
          },
      },
}))
jest.mock('react-router', ()=>({
    ...jest.requireActual('react-router'),
    useNavigate:jest.fn()
}))
jest.mock('react-query',()=>({
    useMutation:()=>{
        return({
            isLoading:false
        })
    }
}))

jest.mock('../../utils/hooks/useSignUpUser')

describe('SignUp test funcionality', ()=>{
    test('Successfull button login funcionality when is clicked', async()=>{
        const mockHandlerSignup = jest.fn()
        useSignUp.mockImplementation(() => {
            return {
              handleSubmit: mockHandlerSignup
            };
        });                   

        render(
        <BrowserRouter>
            <Signup />
        </BrowserRouter>
        )
        
        const buttonSubmit = screen.getByTestId('buttonSignup')
        const username = screen.getByTestId('usernameSignup').children[1].firstElementChild
        const email = screen.getByTestId('emailSignup').children[1].firstElementChild
        const password = screen.getByTestId('passwordSignup').children[1].firstElementChild
        const checkPrivacy = screen.getByTestId('checkTermSignup')
        const checkTerms = screen.getByTestId('checkPrivacySignup')


        fireEvent.change(username, {target:{value:'newUsername'}})
        fireEvent.change(email, {target:{value:'newUsername@gmail.com'}})
        fireEvent.change(password, {target:{value:'testPassword123123'}})
        fireEvent.click(checkPrivacy)
        fireEvent.click(checkTerms)
        fireEvent.click(buttonSubmit)

        await waitFor(()=>{
            expect(useSignUp().handleSubmit).toBeCalledTimes(1)
        })
    })  
})