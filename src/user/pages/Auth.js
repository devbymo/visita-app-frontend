import React, { useCallback, useReducer, useContext } from 'react';

import styled from 'styled-components';
import Button from '../../shared/components/Button/Button';
import Input from '../../shared/components/Input/Input';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import LoaderSpinner from '../../shared/components/LoaderSpinner/LoaderSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import ImageUpload from '../../shared/components/ImageUpload/ImageUpload';

const StyledAuth = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
  max-width: 100vw;
  font-size: 2rem;
  padding-top: 7rem;
  padding-bottom: 7rem;

  h1 {
    font-size: 4rem;
    font-weight: 500;
    margin-top: 5rem;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 4rem;
    color: #000;
    font-size: 2rem;
    width: 35vw;
    background-color: #ebebeb;
    padding: 3rem 5rem;
    border-radius: 1rem;
    margin-top: 3rem;
  }

  .error-mes {
    color: red;
    padding-top: 1rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .form-container {
      width: 80vw;
      padding: 5rem;
    }

    h1 {
      margin-top: 10rem;
    }
  }
`;

const Auth = () => {
  // Managing overall state of the form.
  const initialState = {
    name: {
      value: '',
      isValid: false,
    },
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    },
    address: {
      value: '',
      isValid: false,
    },
    image: {
      value: null,
      isValid: false,
    },
    isFormSubmitted: false,
    isLoading: false,
    isLoginMode: true,
    isFormValid: false,
    error: null,
  };
  const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let isFormValid = true;
        for (const inputId in state.inputs) {
          if (inputId === action.inputId) {
            isFormValid = isFormValid && action.isValid;
          } else {
            isFormValid = isFormValid && state.inputs[inputId].isValid;
          }
        }
        return {
          ...state,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
          isFormValid: isFormValid,
        };
      case 'SET_FORM_SUBMITTED':
        return {
          ...state,
          isFormSubmitted: action.isFormSubmitted,
        };
      case 'SET_LOADING':
        return {
          ...state,
          isLoading: action.isLoading,
        };
      case 'SET_LOGIN_MODE':
        return {
          ...state,
          isLoginMode: action.isLoginMode,
        };
      case 'SET_ERROR':
        return {
          ...state,
          error: action.error,
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };

  const [formState, dispatch] = useReducer(formReducer, initialState);

  // Authantication context.
  const { isAuthenticated, login, logout } = useContext(AuthContext);

  const inputChangeHandler = useCallback(
    (id, value, isValid) => {
      dispatch({
        type: 'INPUT_CHANGE',
        inputId: id,
        value: value,
        isValid: isValid,
      });
    },
    [dispatch]
  );

  const signupHandler = async () => {
    try {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      let formData = new FormData();
      formData.append('name', formState.name.value);
      formData.append('email', formState.email.value);
      formData.append('password', formState.password.value);
      formData.append('address', formState.address.value);
      formData.append('image', formState.image.value);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/users/signup`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data);
      dispatch({ type: 'SET_LOADING', isLoading: false });

      if (data.error || !res.ok) {
        dispatch({
          type: 'SET_ERROR',
          error: data.error.message || 'Unable to signup!',
        });
      } else {
        dispatch({ type: 'RESET' });
        const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour
        login(data.user.id, data.token, expirationTime);
      }

      dispatch({ type: 'SET_FORM_SUBMITTED', isFormSubmitted: true });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  const loginHandler = async () => {
    try {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.email.value,
            password: formState.password.value,
          }),
        }
      );

      const data = await res.json();
      dispatch({ type: 'SET_LOADING', isLoading: false });

      if (data.error || !res.ok) {
        dispatch({
          type: 'SET_ERROR',
          error: data.error.message || 'Unable to login!',
        });
      } else {
        dispatch({ type: 'RESET' });
        const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60); // 1H
        login(data.user.id, data.token, expirationTime);
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err.message });
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  const authModelHandler = (e) => {
    // Toggle between login and signup mode.
    e.preventDefault();
    dispatch({ type: 'SET_LOGIN_MODE', isLoginMode: !formState.isLoginMode });
    dispatch({ type: 'SET_ERROR', error: null });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    //=============================================
    // Data is valid and can be sent to the server.
    //=============================================

    if (formState.isLoginMode) {
      loginHandler();
    } else {
      signupHandler();
    }
  };

  const loginValidityHandler = () => {
    if (formState.email.isValid) {
      if (formState.password.isValid) {
        return false;
      }
    }

    return true;
  };

  const signupValidityHandler = () => {
    if (formState.name.isValid) {
      if (formState.email.isValid) {
        if (formState.password.isValid) {
          if (formState.address.isValid) {
            return false;
          }
        }
      }
    }

    return true;
  };

  return (
    <StyledAuth>
      {isAuthenticated ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <>
          <h1>{formState.isLoginMode ? 'Login' : 'Signup'}</h1>
          <form className="form-container">
            {!formState.isLoginMode && (
              <Input
                id="name"
                element="input"
                type="text"
                placeholder="Ex. Mohamed Yasser"
                lable="Name *"
                errorText="Please enter a valid name"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
                onInput={inputChangeHandler}
              />
            )}
            {!formState.isLoginMode && (
              <Input
                id="address"
                element="input"
                type="text"
                placeholder="Ex. Egypt - Alexandria"
                lable="Adress *"
                errorText="Please enter a valid address"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                onInput={inputChangeHandler}
              />
            )}
            {!formState.isLoginMode && (
              <ImageUpload id="image" onInput={inputChangeHandler} />
            )}
            <Input
              id="email"
              element="input"
              type="email"
              placeholder="Ex. name@gmail.com"
              lable="E-mail *"
              errorText="Please enter a valid email"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
              onInput={inputChangeHandler}
            />
            <Input
              id="password"
              element="input"
              type="password"
              placeholder="**********"
              lable="Password *"
              errorText="Please enter a password of at least 5 characters"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
              onInput={inputChangeHandler}
            />
            {formState.isLoading ? (
              <LoaderSpinner
                isVisable={true}
                color="#3498db"
                backgroundColor="#f3f3f3"
                size=".5"
                widthAndHeight="4"
                speedInSecond=".6"
              />
            ) : (
              <Button
                onClick={formSubmitHandler}
                disabled={
                  formState.isLoginMode
                    ? loginValidityHandler()
                    : signupValidityHandler()
                }
              >
                {formState.isLoginMode ? 'LOGIN' : 'SIGNUP'}
              </Button>
            )}
            <Button danger onClick={authModelHandler}>
              SWITCH TO {formState.isLoginMode ? 'SIGNUP' : 'LOGIN'}
            </Button>
            <p className="error-mes">{formState.error && formState.error}</p>
          </form>
        </>
      )}
    </StyledAuth>
  );
};

export default Auth;
