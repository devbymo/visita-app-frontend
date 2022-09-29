import React, { useState, useContext } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import Overlay from '../UI/Overlay';
import { AuthContext } from '../../context/auth-context';
import StyledNavbar from './StyledNavbar';

const Navbar = () => {
  const { isAuthenticated, userId } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <StyledNavbar>
      <Overlay show={open} closeMenu={closeMenu} />
      <NavLink to="/" className="nav-logo">
        Visita
      </NavLink>
      <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div>
      <ul className={open ? 'nav-links active' : 'nav-links'}>
        <li className="nav-item">
          <NavLink to="/" className="nav-link" onClick={closeMenu}>
            All Users
          </NavLink>
        </li>
        {isAuthenticated && (
          <li className="nav-item">
            <NavLink
              to={`/${userId}/places`}
              className="nav-link"
              activeClassName={'nav-link-active'}
              onClick={closeMenu}
            >
              My Places
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li className="nav-item">
            <NavLink
              to="/places/new"
              className="nav-link"
              activeClassName={'nav-link-active'}
              onClick={closeMenu}
            >
              Add Place
            </NavLink>
          </li>
        )}
        {!isAuthenticated && (
          <li className="nav-item">
            <NavLink
              to="/auth"
              className="nav-link"
              activeClassName={'nav-link-active'}
              onClick={closeMenu}
            >
              Signup/Login
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li className="nav-item">
            <NavLink
              to="/auth"
              className="nav-link"
              activeClassName={'nav-link-active'}
              onClick={closeMenu}
            >
              Logout
            </NavLink>
          </li>
        )}
      </ul>
    </StyledNavbar>
  );
};

export default Navbar;
