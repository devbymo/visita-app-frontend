import { useState, useCallback, useEffect } from 'react';
let logoutTimer;

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const storeUserDataInLocalStorage = (token, userId, tokenExpirationDate) => {
    try {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: userId,
          token: token,
          tokenExpirationDate: tokenExpirationDate.toISOString(),
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const login = useCallback((userId, token, tokenExpirationDate) => {
    setIsAuthenticated(true);
    setToken(token);
    setUserId(userId);
    // 1H expiration time for the token.
    const expirationTime =
      tokenExpirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate || expirationTime);
    storeUserDataInLocalStorage(token, userId, expirationTime);
  }, []);

  const logout = useCallback(async () => {
    // Clear the token and userId from the state.
    setIsAuthenticated(false);
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);

    // Clear the token and userId from the local storage.
    localStorage.removeItem('userData');
  }, []);

  // Auto login.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.tokenExpirationDate) > new Date()
    ) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  // Auto logout.
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { login, logout, isAuthenticated, userId, token };
};

export default useAuth;
