import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <>
    <SideBar/>
    <main>
      <Outlet/>
    </main>
    </>
  )
}

