import { useState } from 'react';
import validation from './SignupValidation';
import { useSignUp } from '../../utils/hooks/useSignUpUser';

const initialData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

const SignupForm = () => {
  const [registerData, setRegisterData] = useState(initialData);
  const [errors, setErrors] = useState(initialData);
  const { handleSubmit } = useSignUp();

  const [isChecked, setIsChecked] = useState(false);

  const onRegisterClick = async (ev) => {
    ev.preventDefault();

    const [errors] = validation(registerData);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const userData = {
        username: registerData.username.toLowerCase(),
        email: registerData.email,
        password: registerData.password,
      };

      handleSubmit(userData);
    }
  };

  const onInputChange = (ev) => {
    if (ev.target.name === 'terms') {
      setIsChecked(!isChecked);
      ev.target.value = !isChecked;
    }

    const name = ev.target.name;
    const value = ev.target.value;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  return (
    <div>
      <form>
        {/* <!-- Name input --> */}
        <div className="form-outline mb-4 mt-4">
          <input
            type="text"
            className="form-control "
            placeholder="Username"
            name="username"
            value={registerData.username}
            onChange={onInputChange}
          />
          {errors.username && (
            <div className="text-danger">{errors.username}</div>
          )}
        </div>
        {/* <!-- Email input --> */}
        <div className="form-outline mb-4 mt-4">
          <input
            type="email"
            className="form-control"
            placeholder="E-mail"
            name="email"
            value={registerData.email}
            onChange={onInputChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        {/* <!-- Password input --> */}
        <div className="form-outline mb-4 mt-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            value={registerData.password}
            onChange={onInputChange}
          />
          {errors.password && (
            <div className="text-danger">{errors.password}</div>
          )}
        </div>

        <div className="form-outline mb-4 mt-4">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={onInputChange}
          />
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </div>

        {/* <!-- 2 column grid layout for inline styling --> */}
        <div className="row mb-4 mt-4">
          <div className="col d-flex">
            {/* <!-- Checkbox --> */}
            <div className="form-check">
              <input
                className="form-check-input"
                name="terms"
                type="checkbox"
                id="signup-terms"
                checked={isChecked}
                onChange={onInputChange}
              />
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noreferrer">
                Terms and Conditions
              </a>
              {errors.terms && (
                <div className="text-danger">{errors.terms}</div>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Submit button --> */}
        <button
          type="button"
          className="btn btn-primary btn-block mb-4 w-100"
          onClick={onRegisterClick}
        >
          SignUp
        </button>
      </form>
    </div>
  );
};
export default SignupForm;
