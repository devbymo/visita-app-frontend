import React from 'react';

import styled from 'styled-components';
import Button from '../../shared/components/Button/Button';

const StyledNotFoundPlace = styled.div`
  height: 70vh;
  font-size: 4rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;

const PlaceNotFound = (props) => {
  return (
    <StyledNotFoundPlace>
      <p>{props.errorMessage || 'There is no place!'}</p>
      {props.buttonText && props.to && (
        <Button to={props.to || '/'}>{props.buttonText || 'HOME'}</Button>
      )}
    </StyledNotFoundPlace>
  );
};

export default PlaceNotFound;
