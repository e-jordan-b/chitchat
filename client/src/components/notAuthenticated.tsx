import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UnAuthenticated= ({ children }: {children: React.ReactNode}) => {
  const { user } = useAuth();

  return !user ? children : <Navigate to={"/"} replace />;
};

export default UnAuthenticated;