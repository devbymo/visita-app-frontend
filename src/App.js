import './App.css';
import { Redirect, Route, Switch } from 'react-router-dom';
// import Users from './user/pages/Users';
// import NewPlace from './place/pages/NewPlace';
// import UserPlaces from './place/pages/UserPlaces';
// import UpdatePlace from './place/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import Navbar from './shared/components/Navigation/Navbar';
import { AuthContext } from './shared/context/auth-context';
import useAuth from './shared/hooks/useAuth';
import React, { Suspense } from 'react';

// For reducing initial render time
const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./place/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./place/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./place/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

function App() {
  const { login, logout, isAuthenticated, userId, token } = useAuth();

  let routes;

  if (isAuthenticated) {
    routes = (
      <Switch>
        {/* The root page which display all users */}
        <Route path="/" exact>
          <Users />
        </Route>
        {/* Display all users */}
        <Route path="/users" exact>
          <Redirect to="/" />
        </Route>
        {/* Display user places */}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        {/* Create new place */}
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        {/* Update The place */}
        <Route path="/:creatorId/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        {/* Auth page */}
        <Route path="/auth" exact>
          <Auth />
        </Route>
        {/* Page not found error */}
        {/* <Route path="*">
          <NotFound />
        </Route> */}
        {/* The default page */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* The root page which display all users */}
        <Route path="/" exact>
          <Users />
        </Route>
        {/* Display all users */}
        <Route path="/users" exact>
          <Redirect to="/" />
        </Route>
        {/* Display user places */}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        {/* Auth page */}
        <Route path="/auth" exact>
          <Auth />
        </Route>
        {/* Page not found error */}
        {/* <Route path="*">
          <NotFound />
        </Route> */}
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userId, token }}
    >
      <div className="app">
        <header>
          <Navbar />
        </header>
        <main>
          <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
