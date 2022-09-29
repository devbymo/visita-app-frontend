// Create a not found page
import React from 'react';
import styled from 'styled-components';

const StyledNotFound = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NotFound = () => {
  return (
    <StyledNotFound>
      <h2>404 Not Found</h2>
    </StyledNotFound>
  );
};

export default NotFound;
