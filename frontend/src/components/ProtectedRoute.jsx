import { Navigate } from 'react-router';

function ProtectedRoute({ auth, children }) {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;