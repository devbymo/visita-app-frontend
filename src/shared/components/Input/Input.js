import React, { useReducer, useEffect } from 'react';
import { validate } from '../../util/validators';
import StyledInput from './StyledInput';

// useReducer properties:
// 1. reducer: function that takes [state] and [action] as arguments and returns [new state]
// 2. initialState: initial state of the reducer
// 3. children: function that takes state and dispatch as arguments and returns JSX
// 4. initializer: function that takes state and action as arguments and returns new state

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return {
        ...state,
        value: action.value,
        isValid: true,
      };
    case 'CHANGE':
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  // State management with useReducer.
  const initialState = {
    value: props.value || '',
    isValid: props.valid || false,
    isTouched: false,
  };
  const [inputState, dispatch] = useReducer(inputReducer, initialState);

  const defaultRowsValue = 10;

  // Input change handler.
  const onInputChangeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      value: event.target.value,
      validators: props.validators,
    });
  };

  // Input touch handler.
  const onInputTouchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  // Forwards the input state values to the parent component.
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // Element to display.
  const element =
    props.element === 'textarea' ? (
      <textarea
        id={props.id}
        rows={props.rows || defaultRowsValue}
        onChange={onInputChangeHandler}
        onBlur={onInputTouchHandler}
        value={props.value}
      />
    ) : (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onInputChangeHandler}
        onBlur={onInputTouchHandler}
        value={props.value}
        disabled={props.disabled}
      />
    );

  return (
    <StyledInput isValid={inputState.isValid} isTouched={inputState.isTouched}>
      <label htmlFor={props.id}>{props.lable}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p className="error-text">{props.errorText}</p>
      )}
    </StyledInput>
  );
};

export default Input;
