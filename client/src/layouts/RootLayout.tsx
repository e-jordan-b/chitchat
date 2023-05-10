import NavBar from '../components/NavBar'
import NavBarV2 from '../components/NavBarV2'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="flex">
      <NavBar/>
      {/* <NavBarV2/> */}
      <main className='h-screen w-full flex justify-center items-center'>
        <Outlet/>
      </main>
    </div>
  )
}

