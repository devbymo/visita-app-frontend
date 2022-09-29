import React from 'react';
import styled from 'styled-components';

const StyledSpinner = styled.div`
  display: ${({ isVisable }) => (!isVisable ? 'none' : 'block')};

  border: ${({ backgroundColor, size }) =>
    `${size}rem solid ${backgroundColor}` || '1rem solid #f2f2f2'};

  border-radius: 50%;

  border-top: ${({ color, size }) =>
    `${size}rem solid ${color}` || '1rem solid #000'};

  width: ${({ widthAndHeight }) =>
    widthAndHeight ? `${widthAndHeight}rem` : '4rem'};

  height: ${({ widthAndHeight }) =>
    widthAndHeight ? `${widthAndHeight}rem` : '4rem'};

  -webkit-animation: spin ${({ speed }) => (speed ? `${speed}s` : '0.7s')}
    linear infinite; /* Safari */
  animation: spin
    ${({ speedInSecond }) => (speedInSecond ? `${speedInSecond}s` : '0.7s')}
    linear infinite;
  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoaderSpinner = (props) => {
  return (
    <StyledSpinner
      isVisable={props.isVisable}
      color={props.color}
      backgroundColor={props.backgroundColor}
      size={props.size}
      widthAndHeight={props.widthAndHeight}
      speedInSecond={props.speedInSecond}
    />
  );
};

export default LoaderSpinner;
