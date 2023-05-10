import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UnAuthenticated= ({ children }: {children: React.ReactNode}) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to={"/"} replace />;
};

export default UnAuthenticated;