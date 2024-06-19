import { Navigate, Route, useLocation } from 'react-router-dom';
import { saveLastRoute } from '../../application/Redux/slices/LastRouteSlice';
import { useAppDispatch } from '../../application/Redux/store/store';

/* eslint-disable react/jsx-no-useless-fragment */
const PrivateRoute: React.FC<{
  element: React.ReactNode;
}> = ({ element }) => {
  const tempVar = localStorage.getItem('userInfo') || 'false';
  const isAuthenticated = JSON.parse(tempVar)?.userId || false;
  const dispatch = useAppDispatch();
  const location = useLocation();

  console.log('last Location');
  console.log(location);

  // Save the current location in state if user is not authenticated
  if (!isAuthenticated) {
    dispatch(saveLastRoute({ from: location }));
  }

  return isAuthenticated ? <>{element}</> : <Navigate to="/signIn" replace />;
  // return <>{element}</>;
};

export default PrivateRoute;
