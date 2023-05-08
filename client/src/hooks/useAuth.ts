import { useState } from "react";
import authService from "../services/authService";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const loginWithCredentials = (username: string, password: string) => {
    const success = authService.loginWithCredentials(username, password);
    setIsAuthenticated(success);
    return success;
  };

  const loginWithGoogle = () => {
    const success = authService.loginWithGoogle();
    setIsAuthenticated(success);
    return success;
  };

  const loginWithGitHub = () => {
    const success = authService.loginWithGitHub();
    setIsAuthenticated(success);
    return success;
  };

  return {
    isAuthenticated,
    loginWithCredentials,
    loginWithGoogle,
    loginWithGitHub,
  };
};

export default useAuth;
