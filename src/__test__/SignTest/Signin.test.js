/* eslint-disable testing-library/no-node-access */
import '@testing-library/jest-dom/extend-expect'
import Signin from "../../pages/Signin/Signin";
import { BrowserRouter } from "react-router-dom";
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { useLogin } from '../../utils/hooks/useLoginUser';

jest.mock('react-query', ()=>({
    useMutation:()=>{
        return{
            isLoading:false
        }
    }
}))
jest.mock("../../utils/hooks/useLoginUser")
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

describe('SignIn test funcionality', ()=>{
    test('SignIn make the call when is clicked', async()=>{
        const mockHandleSubmit = jest.fn();
        useLogin.mockImplementation(()=>{
            return{
                handleSubmit:mockHandleSubmit
            }
        })
        render(
            <BrowserRouter>
                <Signin />
            </BrowserRouter>
        )
        
        const username = screen.getByTestId('usernameSignin').children[1].firstElementChild
        const password = screen.getByTestId('passwordSignin').children[1].firstElementChild
        const button = screen.getByTestId("signin-button")

        //Act
        fireEvent.change(username, {target:{value:'reacter'}})
        fireEvent.change(password, {target:{value:'testPassword'}})
        fireEvent.click(button)
        
        await waitFor(()=>{
            expect(useLogin().handleSubmit).toBeCalledTimes(1)
        })

    })
})