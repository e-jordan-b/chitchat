import { useState, useEffect } from 'react'
import { fetchUser } from '../services/user-service';
import { User } from '../types/userType';

const useAuth = () => {
  const user = true;
  return { user };
};

export default useAuth;


// const useAuth = () => {
//   const [user, setUser] = useState<User | undefined>();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | undefined>();

//   const fire = async () => {
//     console.log('fired')
//     setLoading(true);

//     const { user, error } = await fetchUser();

//     if (error) {
//       console.log('error')
//       setError(error);
//       setLoading(false);
//       return;
//     }
//     console.log('down')
//     setUser(user);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fire();
//   }, []);

//   return { user, setUser, loading, error, fire };
// };

// export default useAuth;