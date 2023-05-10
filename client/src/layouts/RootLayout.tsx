import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="flex">
      <NavBar/>
      <main className='h-screen w-full flex justify-center items-center'>
        <Outlet/>
      </main>
    </div>
  )
}

