import { NavLink } from 'react-router-dom';


export default function Landing() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>Landing Page</h1>

      <NavLink className="btn-primary mt-5" to={"/app/dashboard" }>login</NavLink>
    </div>

  )
}

