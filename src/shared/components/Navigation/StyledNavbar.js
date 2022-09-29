import styled from 'styled-components';

const StyledNavbar = styled.nav`
  height: 80px;
  width: 100%;
  background: #334155;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rem;
  font-size: 2.4rem;
  position: fixed;
  z-index: 10000;

  .nav-logo {
    font-size: 4rem;
    font-weight: 500;
    text-decoration: none;
    color: white;
  }

  .nav-item:not(:last-child) {
    padding-right: 4rem;
  }

  .nav-links {
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-gap: 20px;
    list-style: none;
  }

  .nav-link {
    text-decoration: none;
    color: white;
    transition: 0.2s all;
  }

  .nav-link:hover {
    color: salmon;
  }

  .nav-link-active {
    color: salmon;
  }

  .nav-icon {
    display: none;
    font-size: 4rem;
    cursor: pointer;
  }

  @media only screen and (max-width: 950px) {
    position: fixed;

    .nav-links {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      width: 100%;
      top: 80px;
      left: -100%;
      transition: 0.5s all;
    }

    .nav-links.active {
      background: #334155;
      left: 0;
    }

    .nav-links.active .nav-item {
      text-align: center;
      padding: 0;
      width: 80%;
      padding-bottom: 2rem;
    }

    .nav-links.active .nav-item:not(:last-child) {
      border-bottom: 1px solid #777;
    }

    .nav-icon {
      display: flex;
    }
  }
`;

export default StyledNavbar;
