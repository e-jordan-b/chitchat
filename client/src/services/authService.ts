let authenticated = false;

const loginWithCredentials = (username: string, password: string): boolean => {
  if (username === "user" && password === "password") {
    authenticated = true;
    return true;
  } else {
    authenticated = false;
    return false;
  }
};

const loginWithGoogle = (): boolean => {
  return loginWithCredentials("fake", "stuff");
};

const loginWithGitHub = (): boolean => {
  return loginWithCredentials("fake", "stuff");
};

const isAuthenticated = (): boolean => {
  return authenticated;
};

const authService = {
  loginWithCredentials,
  loginWithGoogle,
  loginWithGitHub,
  isAuthenticated,
};

export default authService;
