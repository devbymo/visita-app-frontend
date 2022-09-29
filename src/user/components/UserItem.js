import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// import classes from './UserItem.module.css';

const Wrapper = styled.div`
  margin: 0 auto;
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
  a {
    text-decoration: none;
    color: #000;
  }

  &:not(:last-child) {
    margin-bottom: 4rem;
  }
`;

const StyledUserItem = styled.li`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40vw;
  height: 27rem;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    filter: brightness(120%);
  }

  .image-container {
    flex: 3;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .user__image {
      height: 100%;
      width: 100%;
      display: block;
    }
  }

  .user__info {
    flex: 4;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    .user__name {
      font-style: italic;
      font-weight: 600;
      font-size: 3rem;
    }

    .user__address {
      margin: 1.5rem 0;
      font-size: 1.8rem;
      font-weight: 400;
    }

    .user__places {
      font-size: 1.8rem;
      font-weight: 400;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    width: 80vw;
  }
`;

const UserItem = (props) => {
  return (
    <Wrapper>
      <Link to={`/${props.id}/places`}>
        <StyledUserItem>
          <div className="image-container">
            <img
              src={
                props.image
                  ? `${process.env.REACT_APP_BACKEND_URL}/${props.image}`
                  : 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjd8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
              }
              alt="User profile"
              className="user__image"
            />
          </div>
          <div className="user__info">
            <h2 className="user__name">{props.name} ✨</h2>
            <p className="user__address">{props.address} 🏠</p>
            <p className="user__places">
              {props.placeNums} {props.placeNums > 1 ? 'Places' : 'Place'} 🎯
            </p>
          </div>
        </StyledUserItem>
      </Link>
    </Wrapper>
  );
};

export default UserItem;
