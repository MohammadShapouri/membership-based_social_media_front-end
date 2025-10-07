import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from '../../context/UserContext';

/**
 * Wrap any private route
 * Redirects to /login if user is not logged in
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // spinner or skeleton
  }

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
