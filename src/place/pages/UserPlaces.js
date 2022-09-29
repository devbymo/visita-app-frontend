import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import PlaceList from '../components/PlaceList';
import LoaderSpinner from '../../shared/components/LoaderSpinner/LoaderSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import PlaceNotFound from '../components/PlaceNotFound';

const StyledPlaces = styled.div`
  min-height: 100vh;
  padding: 10rem 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .error-msg {
    color: red;
    font-size: 2.2rem;
  }
`;

const DUMMY_PLACES = [
  {
    id: 1,
    imageURL:
      'https://media.istockphoto.com/photos/paris-aerial-panorama-with-river-seine-and-eiffel-tower-france-picture-id1336449613?b=1&k=20&m=1336449613&s=170667a&w=0&h=atFJsGNEMuHaPll6bRwOkZl8Q0Iz83EcUUi0SvhAeM8=',
    placeName: 'Paris',
    description:
      'Paris is one of the most beautiful cities in the world. It is known worldwide for the Louvre Museum, Notre-Dame cathedral, and the Eiffel tower. It has a reputation of being a romantic and cultural city. The city is also known for its high-quality gastronomy and the terraces of its cafés',
    address: {
      country: 'France',
      city: 'Paris',
    },
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    rating: 4.5,
    creator: 'user1',
  },
  {
    id: 2,
    imageURL:
      'https://media.istockphoto.com/photos/shore-of-alexandria-egypt-picture-id157316325?b=1&k=20&m=157316325&s=170667a&w=0&h=qIojlEvA4WbM-LTXhInTzN-kEKGqb7S1uWmqtLC2wwY=',
    placeName: 'Alexandria',
    description:
      'One of Egypts largest cities, Alexandria is also its principal seaport and a major industrial centre. The city lies on the Mediterranean Sea at the western edge of the Nile River delta, about 114 miles (183 km) northwest of Cairo in Lower Egypt. Area city, 116 square miles',
    address: {
      country: 'Egypt',
      city: 'Alexandria',
    },
    location: {
      lat: 31.2001,
      lng: 29.9187,
    },
    rating: 0,
    creator: 'user1',
  },
  {
    id: 3,
    imageURL:
      'https://media.istockphoto.com/photos/nyhavn-copenhagen-denmark-picture-id901375804?b=1&k=20&m=901375804&s=170667a&w=0&h=SjhoV9MfiKSfJ4JVT7y62sfjlpq-OUqfjEhJwMlZQTY=',
    placeName: 'Copenhagen',
    description:
      'Copenhagen is a unique city, characterized by its canals, cycling culture, strong economy, and happy locals. It is actually known as being the happiest city in the world, due to its shorter workdays, free college tuition, more vacation days, and levels of personal interaction.',
    address: {
      country: 'Denmark',
      city: 'Copenhagen',
    },
    location: {
      lat: 55.6761,
      lng: 12.5683,
    },
    rating: 1.5,
    creator: 'user2',
  },
];

const UserPlaces = () => {
  const [userPlaces, setUserPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const { userId: authanticatedUserId } = useContext(AuthContext);

  const getUserPlaces = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/places/user/${userId}`
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error.message);
      }

      if (data.places) {
        setUserPlaces(data.places);
      } else {
        setError('There is no places to display!');
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleDeletePlace = async (placeId) => {
    setIsLoading(true);

    const newPlaces = userPlaces.filter((place) => place.id !== placeId);
    setUserPlaces(newPlaces);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserPlaces();
  }, [userId]);

  return (
    <StyledPlaces>
      {isLoading ? (
        <LoaderSpinner
          isVisable={true}
          color="#3498db"
          backgroundColor="#f3f3f3"
          size=".5"
          widthAndHeight="4"
          speedInSecond=".6"
        />
      ) : (
        <PlaceList
          places={userPlaces}
          userId={userId}
          onDelete={handleDeletePlace}
        />
      )}
      {!isLoading ? (
        userPlaces.length === 0 || !userPlaces ? (
          authanticatedUserId === userId ? (
            <PlaceNotFound
              errorMessage="There is no places to show!"
              buttonText="ADD NEW PLACE"
              to="/places/new"
            />
          ) : (
            <PlaceNotFound errorMessage="There is no places to show!" />
          )
        ) : (
          ''
        )
      ) : (
        ''
      )}
    </StyledPlaces>
  );
};

export default UserPlaces;
