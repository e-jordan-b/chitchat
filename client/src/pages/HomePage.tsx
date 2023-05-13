import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export default  function HomePage() {
const navigation = useNavigate();

const userData = {
  email: "test@test.com",
  password: "123456"
}

  const handleLogin = async () => {
    const res = await axios('http://localhost:3001/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(userData),
    });


    console.log(res);

    navigation('/app')
 }


  return (
    <div className="flex flex-col justify-center items-center">
      <h1>
        Landing Page
      </h1>

  <div className="flex justify-between w-40">
    <button onClick={handleLogin}>Login</button>
    <button onClick={() => alert("does not do anything yet")}>Sign Up</button>
  </div>
    </div>

  )
}

