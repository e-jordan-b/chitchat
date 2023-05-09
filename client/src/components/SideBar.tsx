import { NavLink } from 'react-router-dom'

export default function SideBar() {
  return (
    <nav style={{
      left: 0,
      width: '250px',
      height: '100%',
      border: '1px solid black',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'star',
      alignItems: 'start',}}
      >

      <div>avatar goes to profile</div>
      <br />
      <NavLink to="/app/dashboard">dashboard link</NavLink>
      <br />
      <NavLink to="/app/call">make a call? or big floating btn </NavLink>
      <br />
      <div>previous conversations</div>
      <br />
      <NavLink to="/app/settings">settings</NavLink>
      <br />
      <div>
      <input type="text" placeholder="enter invite code"></input>
      <NavLink to="/room/123">join </NavLink>
      </div>
      <NavLink to="/">logout</NavLink>

    </nav>
  )
}
