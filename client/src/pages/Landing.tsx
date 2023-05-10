import { NavLink } from 'react-router-dom';


export default  function Landing() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>
        Landing Page
      </h1>
    <p>should handle login and signup then redicret to OAuth consent screen which redirects to /dashboard</p>

    <NavLink to={"/app/asd/dashboard" }>

         login
        </NavLink>
    </div>

  )
}

