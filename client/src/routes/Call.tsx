import React from 'react'
import { NavLink } from 'react-router-dom';

export default function PreCallScreen(){
 return (
  <>
    <h1>pre call screen</h1>
    <NavLink to="/room/">Start the call</NavLink>
  </>
  )
}
