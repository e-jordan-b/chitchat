import React, { FC, useState} from 'react'
import { User } from '../types/userType';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // LLamar al servicio de signin con user y password
    const userAuth = {
      email,
      password
    }
    
    try {
      const resp = await fetch('http://localhost:3001/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userAuth)
      })
      
      console.log('REEESPONSE', await resp.json())
    } catch (e) {
      console.log(e)
    }
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  
  return (
    <div className='flex items-center justify-center h-screen w-screen'>
      <form onSubmit={handleSubmit} className='flex flex-col shadow-md p-5'>
        <label>Email</label>
        <input
          placeholder='email...'
          type='text'
          name='email'
          value={email}
          onChange={handleUserChange}
          className='mb-5'
        >
        </input>
        <label>Password</label>
        <input
          placeholder='password'
          type='password'
          name='password'
          value={password}
          onChange={handlePasswordChange}
          className='mb-5'
        >
        </input>
        <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded '>Log In</button>

      </form>
    </div>
  )
}

export default Login