import styled from 'styled-components';

const StyleButton = styled.div`
  .button {
    display: inline-block;
    font-size: ${(props) => props.fontSize || '1.8rem'};
    font-weight: 500;
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 0.6rem;
    background-color: ${(props) => props.buttonBackgroundColor || '#2185d0'};
    color: ${(props) => props.buttonTextColor || '#ffffff'};
    cursor: pointer;
    margin-right: 1rem;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
  }

  .button:focus {
    outline: none;
  }

  .button:hover,
  .button:active {
    background-color: ${(props) =>
      props.buttonBackgroundColorHover || '#1e73be'};
    color: ${(props) => props.buttonTextColorHover || '#fff'};
  }

  .button--inverse {
    background: transparent;
    color: #000;
  }

  .button--inverse:hover,
  .button--inverse:active {
    color: white;
    background: salmon;
  }

  .button--danger {
    background: #db2c2c;
    border-color: #db2c2c;
  }

  .button--danger:hover,
  .button--danger:active {
    background: #f34343;
    border-color: #f34343;
  }

  .button:disabled,
  .button:hover:disabled,
  .button:active:disabled {
    background: #ccc;
    color: #979797;
    border-color: #ccc;
    cursor: not-allowed;
  }
`;

export default StyleButton;
