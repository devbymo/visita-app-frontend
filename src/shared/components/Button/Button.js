import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from './StyledButton';

const Button = (props) => {
  if (props.href) {
    return (
      <StyledButton
        buttonBackgroundColor={props.buttonBackgroundColor}
        buttonBackgroundColorHover={props.buttonBackgroundColorHover}
        buttonTextColor={props.buttonTextColor}
        buttonFontSize={props.buttonFontSize}
        buttonTextColorHover={props.buttonTextColorHover}
      >
        <a
          className={`button button--${props.size || 'default'} ${
            props.inverse && 'button--inverse'
          } ${props.danger && 'button--danger'}`}
          href={props.href}
        >
          {props.children}
        </a>
      </StyledButton>
    );
  }
  if (props.to) {
    return (
      <StyledButton
        buttonBackgroundColor={props.buttonBackgroundColor}
        buttonBackgroundColorHover={props.buttonBackgroundColorHover}
        buttonTextColor={props.buttonTextColor}
        buttonTextColorHover={props.buttonTextColorHover}
        buttonFontSize={props.buttonFontSize}
      >
        <Link
          to={props.to}
          exact={props.exact}
          className={`button button--${props.size || 'default'} ${
            props.inverse && 'button--inverse'
          } ${props.danger && 'button--danger'}`}
        >
          {props.children}
        </Link>
      </StyledButton>
    );
  }
  return (
    <StyledButton
      buttonBackgroundColor={props.buttonBackgroundColor}
      buttonBackgroundColorHover={props.buttonBackgroundColorHover}
      buttonTextColor={props.buttonTextColor}
      buttonTextColorHover={props.buttonTextColorHover}
      buttonFontSize={props.buttonFontSize}
    >
      <button
        className={`button button--${props.size || 'default'} ${
          props.inverse && 'button--inverse'
        } ${props.danger && 'button--danger'}`}
        type={props.type}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </StyledButton>
  );
};

export default Button;
