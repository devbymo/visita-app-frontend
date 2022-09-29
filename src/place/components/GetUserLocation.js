import React, { useState, useEffect } from 'react';
import Button from '../../shared/components/Button/Button';
import LoaderSpinner from '../../shared/components/LoaderSpinner/LoaderSpinner';
import styled from 'styled-components';

const StyledUserLocation = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;

  p {
    margin-top: 1rem;
    font-size: 1.7rem;
    font-weight: 400;
  }

  .error-text {
    color: red;
  }

  .success-text {
    color: green;
  }
`;

const GetUserLocation = (props) => {
  // State Mangement.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { isFormSubmitted } = props;

  // Reset state.
  useEffect(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, [isFormSubmitted]);

  // Get lat, lng from user.
  const pickCurrentLocationHandler = async (e) => {
    e.preventDefault();
    // Start loading.
    setIsLoading(true);

    let errorText = undefined;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Get address from latitude and longitude.
          getAddressFromLatLng(latitude, longitude, errorText);
        },
        (error) => {
          setIsLoading(false);
          errorText = error.message;
          setError(errorText);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      errorText = 'Geolocation is not supported by this browser.';
      setIsLoading(false);
      setError(errorText);
    }

    return null;
  };

  // Convert latitude and longitude to address.
  const getAddressFromLatLng = async (latitude, longitude, errorText) => {
    let address = '';
    const APIKeys = 'fbadb263b1fcf914a168438770e966ab';
    const url = `http://api.weatherstack.com/current?access_key=${APIKeys}&query=${latitude},${longitude}`;

    try {
      const response = await fetch(url);
      if (response.status !== 200 || response.ok !== true) {
        errorText = 'Something went wrong';
        setIsLoading(false);
        setError(errorText);
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      if (data.location) {
        address = {
          shortName: data.location.region,
          longName: data.location.name,
          country: data.location.country,
        };
      } else {
        errorText = 'Something went wrong';
        setIsLoading(false);
        setError(errorText);
      }
    } catch (error) {
      errorText = error.message;
      setIsLoading(false);
      setError(errorText);
    }

    setIsLoading(false);
    setSuccess(true);
    props.onPickLocation(latitude, longitude, address);
    return null;
  };

  return (
    <StyledUserLocation>
      {!isLoading && !success && (
        <Button onClick={pickCurrentLocationHandler}>
          PICK MY CURRENT LOCATION
        </Button>
      )}
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
      {error && !success && <p className="error-text">{error}!</p>}
      {success && (
        <p className="success-text">Your address has been captured</p>
      )}
    </StyledUserLocation>
  );
};

export default GetUserLocation;
