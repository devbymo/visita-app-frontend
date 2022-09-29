import React, { useState, useEffect } from 'react';
import UserList from '../components/UserList';
import styled from 'styled-components';
import LoaderSpinner from '../../shared/components/LoaderSpinner/LoaderSpinner';

const DUMMY_USERS = [
  {
    id: 'user1',
    name: 'Mohamed Yasser',
    image:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    address: {
      country: 'Egypt',
      city: 'Alexandria',
    },
    placeNums: 10,
  },
  {
    id: 'user2',
    name: 'Ibrahim Ali',
    image:
      'https://images.unsplash.com/photo-1548189797-82c6a7cb85d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDM5fHRvd0paRnNrcEdnfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    address: {
      country: 'France',
      city: 'Paris',
    },
    placeNums: 12,
  },
  {
    id: 'user3',
    name: 'Khaled Mohamed',
    image:
      'https://images.unsplash.com/photo-1651493280013-b1f88c720be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDExfHRvd0paRnNrcEdnfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    address: {
      country: 'USA',
      city: 'New York',
    },
    placeNums: 3,
  },
  {
    id: 'user4',
    name: 'Jonas Michael',
    image:
      'https://images.unsplash.com/photo-1651453172903-d7163a508479?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fHRvd0paRnNrcEdnfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    address: {
      country: 'Italy',
      city: 'Milan',
    },
    placeNums: 2,
  },
];

const StyledUsers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .error-msg {
    color: red;
    font-size: 2.2rem;
  }
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/users`
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error.message);
      }

      if (data.users.length > 0) {
        setUsers(data.users);
      } else {
        setError('There is no users to display!');
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <StyledUsers>
      {users.length > 0 && <UserList users={users} />}
      {isLoading && (
        <LoaderSpinner
          isVisable={true}
          color="#3498db"
          backgroundColor="#f3f3f3"
          size=".5"
          widthAndHeight="4"
          speedInSecond=".6"
        />
      )}
      {error && <p className="error-msg">{error}</p>}
    </StyledUsers>
  );
};

export default Users;
