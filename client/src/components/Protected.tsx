import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Protected = ({ children } : {children: JSX.Element}) => {
  const { user } = useAuth();
  const location = useLocation().pathname;

  return user ? (
    children
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default Protected;