import React, { useCallback, useEffect, useReducer, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../shared/components/Input/Input';
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from '../../shared/components/Button/Button';
import Modal from '../../shared/components/UI/Modal';
import LoaderSpinner from '../../shared/components/LoaderSpinner/LoaderSpinner';
import ReactStars from 'react-rating-stars-component';
import PlaceNotFound from '../components/PlaceNotFound';
import { AuthContext } from '../../shared/context/auth-context';

const DUMMY_PLACES = [
  {
    id: 1,
    imageURL:
      'https://media.istockphoto.com/photos/paris-aerial-panorama-with-river-seine-and-eiffel-tower-france-picture-id1336449613?b=1&k=20&m=1336449613&s=170667a&w=0&h=atFJsGNEMuHaPll6bRwOkZl8Q0Iz83EcUUi0SvhAeM8=',
    placeName: 'Paris',
    description:
      'Paris is one of the most beautiful cities in the world. It is known worldwide for the Louvre Museum.',
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
      'One of Egypts largest cities, Alexandria is also its principal seaport and a major industrial centre.',
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
      'Copenhagen is a unique city, characterized by its canals, cycling culture, strong economy, and happy locals.',
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

const StyledUpdatePlace = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
  width: 100vw;
  height: 100vh;
  font-size: 2rem;
  padding-top: 7rem;

  h1 {
    font-size: 4rem;
    font-weight: 500;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 4rem;
    color: #000;
    font-size: 2rem;
    width: 35vw;
    background-color: #ebebeb;
    padding: 3rem 5rem;
    border-radius: 1rem;
    margin-top: 3rem;
  }

  .error-msg {
    color: red;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .form-container {
      width: 70vw;
      padding: 5rem 4rem;
    }
  }
`;

const NewPlace = () => {
  // Get the placeId from the url.
  const { placeId, creatorId } = useParams();

  const { token } = useContext(AuthContext);

  // Managing the overall (form) state.
  let initialState = {
    title: {
      value: '',
      isValid: true,
    },
    description: {
      value: '',
      isValid: true,
    },
    rating: 0,
    isLoading: false,
    isLoadingUpdate: false,
    isFormSubmitted: false,
    error: null,
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        return {
          ...state,
          [action.input]: {
            ...state[action.input],
            value: action.value,
            isValid: action.isValid,
          },
        };
      case 'LOADING':
        return {
          ...state,
          isLoading: action.isLoading,
        };
      case 'LOADING_UPDATE':
        return {
          ...state,
          isLoadingUpdate: action.isLoadingUpdate,
        };
      case 'FORM_SUBMITTED':
        return {
          ...state,
          isFormSubmitted: action.isFormSubmitted,
        };
      case 'RESET_FORM':
        return initialState;
      case 'ERROR':
        return {
          ...state,
          error: action.error,
        };
      default:
        return state;
    }
  };

  const [formState, dispatch] = useReducer(formReducer, initialState);

  // Updated every time the input changes - live connection.
  // useCallback is used to prevent the function from re-rendering every time the input changes.
  const inputChangedHandler = useCallback(
    (id, value, isValid) => {
      dispatch({
        type: 'INPUT_CHANGE',
        value,
        isValid,
        input: id,
      });
    },
    [dispatch]
  );

  const closeModalHandler = () => {
    // By submitting the form we can close the modal.
    dispatch({
      type: 'FORM_SUBMITTED',
    });
  };

  const fetchPlaceById = async () => {
    dispatch({
      type: 'LOADING',
      isLoading: true,
    });

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (!data.place) {
        dispatch({
          type: 'ERROR',
          error: 'There is no places to update!',
        });
      }

      if (data.place.creator !== creatorId) {
        dispatch({
          type: 'ERROR',
          error: 'You are not the creator of this place!',
        });
      }

      if (data.place.creator === creatorId) {
        dispatch({
          type: 'INPUT_CHANGE',
          value: data.place.title,
          isValid: true,
          input: 'title',
        });
        dispatch({
          type: 'INPUT_CHANGE',
          value: data.place.description,
          isValid: true,
          input: 'description',
        });
        dispatch({
          type: 'INPUT_CHANGE',
          value: data.place.rating,
          isValid: true,
          input: 'rating',
        });
      }

      dispatch({
        type: 'LOADING',
        isLoading: false,
      });
    } catch (err) {
      dispatch({
        type: 'ERROR',
        error: err.message,
      });
      dispatch({
        type: 'LOADING',
        isLoading: false,
      });
    }
  };

  const updatePlace = async () => {
    dispatch({
      type: 'LOADING_UPDATE',
      isLoadingUpdate: true,
    });

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/places/${placeId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formState.title.value,
            description: formState.description.value,
          }),
        }
      );
      const data = await res.json();
      if (!data.updatedPlace || data.error) {
        dispatch({
          type: 'ERROR',
          error: data.error,
        });
      }

      dispatch({
        type: 'LOADING_UPDATE',
        isLoadingUpdate: false,
      });
      dispatch({
        type: 'FORM_SUBMITTED',
        isFormSubmitted: true,
      });
    } catch (err) {
      dispatch({
        type: 'ERROR',
        error: err.message,
      });
      dispatch({
        type: 'LOADING_UPDATE',
        isLoadingUpdate: false,
      });

      dispatch({
        type: 'FORM_SUBMITTED',
        isFormSubmitted: false,
      });
    }
  };

  const onFormSubmitHandler = (e) => {
    e.preventDefault();

    updatePlace();
  };

  // Fetch the place by id.
  useEffect(() => {
    fetchPlaceById();
  }, []);

  return (
    <StyledUpdatePlace>
      {!formState.isLoading && !formState.error && <h1>Update Place</h1>}
      {formState.isFormSubmitted ? (
        <Modal
          show={formState.isFormSubmitted}
          closeModal={closeModalHandler}
          width="30vw"
          height="20vh"
          widthResponsive="80vw"
          heightResponsive="20vh"
          modalBackgroundColor="#fff"
          modalTextColor="#000"
          modalFontSize="2.2rem"
          modalBorderRadius="10px"
          modalBorder="1px solid #fff"
          modalPadding="0 0 3rem 0"
          overlayBackgroundColor="rgba(0,0,0,0.65)"
          button={true}
          buttonText="Back"
          buttonBackgroundColor="#00b894"
          buttonBackgroundColorHover="#00a88e"
          buttonTextColor="#fff"
          buttonTextColorHover="#fff"
          buttonTo={`/${creatorId}/places`}
        >
          {formState.error ? (
            <p>{formState.error}</p>
          ) : (
            <p>Place updated successfully!</p>
          )}
        </Modal>
      ) : null}
      {formState.error && (
        <PlaceNotFound
          errorMessage="There is no place to update!"
          buttonText="ADD NEW PLACE"
          to="/places/new"
        />
      )}
      {formState.isLoading && (
        <LoaderSpinner
          isVisable={true}
          color="#3498db"
          backgroundColor="#f3f3f3"
          size=".5"
          widthAndHeight="4"
          speedInSecond=".6"
        />
      )}
      {!formState.isLoading && !formState.error && (
        <form className="form-container">
          <Input
            id="title"
            element="input"
            type="text"
            lable="Title *"
            errorText="Please enter a valid name"
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_MAXLENGTH(30),
              VALIDATOR_MINLENGTH(2),
            ]}
            onInput={inputChangedHandler}
            value={formState.title.value}
            valid={formState.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            rows="10"
            lable="Description *"
            errorText="Please enter a discription of at least 10 characters"
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_MINLENGTH(5),
              VALIDATOR_MAXLENGTH(500),
            ]}
            onInput={inputChangedHandler}
            value={formState.description.value}
            valid={formState.description.isValid}
          />
          {formState.isLoading && (
            <LoaderSpinner
              isVisable={true}
              color="#3498db"
              backgroundColor="#f3f3f3"
              size=".5"
              widthAndHeight="4"
              speedInSecond=".6"
            />
          )}
          {!formState.isLoadingUpdate ? (
            <Button
              onClick={onFormSubmitHandler}
              disabled={
                !formState.title.isValid || !formState.description.isValid
              }
            >
              UPDATE PLACE
            </Button>
          ) : (
            <LoaderSpinner
              isVisable={true}
              color="#3498db"
              backgroundColor="#f3f3f3"
              size=".5"
              widthAndHeight="4"
              speedInSecond=".6"
            />
          )}
        </form>
      )}
    </StyledUpdatePlace>
  );
};

export default NewPlace;
