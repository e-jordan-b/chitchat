import {
  MdOutlineDashboard,
  MdOutlineMessage,
  MdOutlineLogout,
  MdOutlineAddIcCall,
  MdSettings
} from "react-icons/md";

import { FaTimes } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { VscDashboard } from "react-icons/vsc";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
const user = {
  id: 1,
  name: "John Doe",
  email: "test@test.com",
  avatar: "https://i.pravatar.cc/150?img=3",
}


const NavBar = () => {
  const [nav, setnav] = useState(false);
  const {isAuthenticated} = useAuth();

  const NavUrl = ({ url, icon, description }: {url:string, icon: React.ReactNode, description: string}) => {
    const checkWindowSize = () => {
      if (window.innerWidth < 1024) setnav(!nav);
    };

    return (
      <li className="">
        <NavLink
          to={`${url}`}
          onClick={() => checkWindowSize()}
          className={({ isActive }) => (isActive ? "" : undefined)}
        >
          {icon}
          <span className="">{description}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <>
    {!isAuthenticated ? null:
    <div className='border border-zinc-700 handle responisiveness here'>

      <nav>
        {/* LOGO */}
        <div >
          <VscDashboard  />
          <FaTimes

            onClick={() => setnav(!nav)}
          />
        </div>

        {/* SUBMENU */}
        <ul className="">
          {/* FIRST CATEGORY */}
          <span >
            {nav ? "PAGES" : <hr />}
          </span>

          <NavUrl
            url={`/app/dashboard`}
            icon={<MdOutlineDashboard />}
            description="Dashboard"
          />

          <NavUrl
            url="/app/call"
            icon={<MdOutlineAddIcCall />}
            description="Start a Call"
          />

        <NavUrl
            url={`/app/conversations`}
            icon={<MdOutlineMessage />}
            description="Conversations"
          />

          {/* SECOND CATEGORY */}
          <span

          >
            {nav ? "More" : <BsThreeDots />}
          </span>



          <NavUrl url="/app/settings" icon={<MdSettings />} description="Settings" />
        </ul>

        {/* LOGOUT BUTTON */}
        <div

          onClick={() => {
            setnav(!nav);
          }}
        >
          <MdOutlineLogout />
        </div>
        {/* ADD BACKGROUND FOR MOBILE */}
      </nav>
    </div>
    }
    </>
  );
};

export default NavBar;