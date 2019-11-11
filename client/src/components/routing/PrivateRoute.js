import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, loadUser } = authContext;
  useEffect(() => {
    loadUser();
    console.log('useEffect in PrivateRoute');
    // eslint-disable-next-line
  },[])
  
  return (
    <Route
      {...rest}
      render={props => (
        !isAuthenticated && !loading ? <Redirect to='/login'/>
        : <Component {...props} />
      )}
    />
  );
};

export default PrivateRoute;
