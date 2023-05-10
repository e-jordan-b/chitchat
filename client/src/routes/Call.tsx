import React from 'react'
import { NavLink } from 'react-router-dom';

export default function PreCallScreen(){
 return (
  <div className='flex flex-col justify-center items-center'>

    <h1>pre call screen</h1>
    <NavLink to="/room/123">Start the call</NavLink>

  </div>
  )
}
