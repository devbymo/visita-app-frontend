import styled from 'styled-components';

const StyledInput = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 0.4rem;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  /* padding: 0 2rem; */

  label {
    font-size: 3rem;
    font-weight: 500;
    align-self: flex-start;
  }

  input {
    width: 100%;
    height: 2rem;
    border-radius: 0.5rem;
    padding: 3rem 1.5rem;
    font-size: 2rem;
    border: 2px solid
      ${(props) => (!props.isValid && props.isTouched ? '#ff0000' : '#fff')};
  }

  input:focus {
    outline: none;
    border-color: #2185d0;
  }

  textarea {
    min-width: 100%;
    height: 20rem;
    border: 2px solid #fff;
    border-radius: 0.5rem;
    padding: 2rem 1.5rem;
    font-size: 2rem;
    resize: none;
    align-self: flex-start;
    border-color: ${(props) =>
      !props.isValid && props.isTouched ? '#ff0000' : '#fff'};
  }

  textarea:focus {
    outline: none;
    border-color: #2185d0;
  }

  .error-text {
    color: #ff0000;
    font-size: 1.65rem;
    align-self: flex-start;
  }
`;

export default StyledInput;
