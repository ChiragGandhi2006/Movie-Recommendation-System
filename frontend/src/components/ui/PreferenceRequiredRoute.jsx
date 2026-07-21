import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FullPageLoader from "./Loader";

export default function PreferenceRequiredRoute({ children }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();

  if (initializing) return <FullPageLoader label="Loading your movie taste..." />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user?.preferences?.length) return <Navigate to="/preferences" replace />;
  return children;
}
