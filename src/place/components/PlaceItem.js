import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Button from '../../shared/components/Button/Button';
import Modal from '../../shared/components/UI/Modal';
import Map from '../../shared/components/Map/Map';
import ReactStars from 'react-rating-stars-component';
import { AuthContext } from '../../shared/context/auth-context';

const StyledPlaceItem = styled.li`
  width: 40vw;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  text-align: center;
  overflow: hidden;
  background-color: #fff;

  &:not(:last-child) {
    margin-bottom: 5rem;
  }

  .place-item__image {
    flex: 1;
    height: 30rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .place-item__info {
    padding: 4rem 0 3rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    border-bottom: 0.1rem solid #000;

    .place-item__name {
      font-style: italic;
      font-weight: 600;
      font-size: 3rem;
    }

    .place-item__address {
      font-size: 1.9rem;
      font-weight: 500;
    }

    .place-item__description {
      font-size: 1.6rem;
      padding: 0 2rem;
    }

    .place-item__rating {
      font-size: 3rem;
    }

    .place-item__rating--error {
      font-size: 2.3rem;
      font-weight: 500;
    }
  }

  .place-item__actions {
    padding: 3rem 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  /* Rsponsive */
  @media (max-width: 768px) {
    width: 80vw;
  }
`;
const PlaceItem = (props) => {
  // Auth context.
  const { isAuthenticated, userId, token } = useContext(AuthContext);

  // Map modal handlers.
  const [showMapModal, setShowMapModal] = useState(false);
  const openMapModelHandler = (e) => {
    // Prevent default behavior of the link.
    e.preventDefault();

    setShowMapModal(true);
  };
  const closeMapModalHandler = () => {
    setShowMapModal(false);
  };

  // Remove modal handlers.
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const openRemoveModalHandler = () => {
    setShowRemoveModal(true);
  };
  const closeRemoveModalHandler = () => {
    setShowRemoveModal(false);
  };

  const removePlaceHandler = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL_API_V1}/places/${props.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();

      
      if (result.error) {
        console.log(result.error);
      }

      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }

    closeRemoveModalHandler();
  };

  // Create stars rating from 0 to 5
  const createStars = (rating) => {
    if (rating <= 0)
      return <span className="place-item__rating--error">No Rating!</span>;

    return (
      <ReactStars count={rating} value={rating} edit={false} isHalf={true} />
    );
  };

  return (
    <StyledPlaceItem className="place-item">
      {/* Modal */}
      {showMapModal && (
        <Modal
          closeModal={closeMapModalHandler}
          show={showMapModal}
          buttonText="Close"
          width="45vw"
          widthResponsive="80vw"
          height="50vh"
          heightResponsive="40vh"
          button={true}
          modalPadding="0"
          modalBorder="2px solid #fafafa"
          buttonBackgroundColor="#fff"
          buttonBackgroundColorHover="#000"
          buttonTextColor="#000"
          buttonTextColorHover="#fff"
          buttonFontSize="1.5rem"
        >
          {<Map location={props.coordinates} /> || 'Unable to display the map!'}
        </Modal>
      )}
      {showRemoveModal && (
        <Modal
          show={showRemoveModal}
          closeModal={closeRemoveModalHandler}
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
          buttonText="confirm"
          buttonBackgroundColor="#830000"
          buttonBackgroundColorHover="salmon"
          buttonTextColor="#fff"
          buttonTextColorHover="#fff"
          buttonOnClick={removePlaceHandler}
        >
          Are you sure you want to remove this place?
        </Modal>
      )}
      {/* Image */}
      <div className="place-item__image">
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/${props.imageURL}`}
          alt={props.placeName}
        />
      </div>
      {/* Info */}
      <div className="place-item__info">
        <h2 className="place-item__name">{props.placeName} ✅</h2>
        <p className="place-item__address">{props.address}</p>
        <p className="place-item__description">{props.description}</p>
        {createStars(props.rating)}
      </div>
      {/* Actions */}
      <div className="place-item__actions">
        <Button onClick={openMapModelHandler}>VIEW ON MAP</Button>
        {isAuthenticated && userId === props.creatorId && (
          <Button to={`/${props.creatorId}/places/${props.id}`}>EDIT</Button>
        )}
        {isAuthenticated && userId === props.creatorId && (
          <Button danger onClick={openRemoveModalHandler}>
            REMOVE
          </Button>
        )}
      </div>
    </StyledPlaceItem>
  );
};

export default PlaceItem;
