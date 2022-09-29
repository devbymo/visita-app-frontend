import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledMap = styled.div`
  width: 100%;
  height: 100%;

  @media (min-width: 768px) {
    width: 50vw;
  }
`;

const Map = (props) => {
  const mapRef = useRef();
  const { lat, lng } = props.location;
  const zoomValue = 10;

  // It will run only once when the component is mounted, and if one of the dependencies changes, it will run again
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: +lat,
        lng: +lng,
      },
      zoom: zoomValue,
    });

    new window.google.maps.Marker({
      position: {
        lat: +lat,
        lng: +lng,
      },
      map,
    });
  }, [lat, lng]);

  // Check the existing of map.
  return !window.google ? (
    <div>Something went wrong, unable to display the map!</div>
  ) : (
    <StyledMap ref={mapRef}>Map</StyledMap>
  );
};

export default Map;

// API key page: https://console.cloud.google.com/apis/credentials?project=civic-axon-350205
