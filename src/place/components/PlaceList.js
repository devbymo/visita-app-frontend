import React from 'react';
import PlaceItem from './PlaceItem';

import styled from 'styled-components';

const StyledPlaceList = styled.div`
  list-style-type: none;

  /* Responsive */
  @media (max-width: 768px) {
    margin-top: 10rem;
  }
`;

const PlaceList = (props) => {
  return (
    <StyledPlaceList>
      {props.places.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          imageURL={place.image}
          placeName={place.title}
          description={place.description}
          address={place.address}
          coordinates={place.coordinates}
          creatorId={place.creator}
          rating={place.rating}
          location={place.location}
          onDelete={props.onDelete}
        />
      ))}
    </StyledPlaceList>
  );
};

export default PlaceList;
