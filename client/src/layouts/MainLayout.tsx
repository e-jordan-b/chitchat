import { ReactNode } from 'react'
import NavBar from '../components/NavBar';

interface Props {
  children: ReactNode;
}

function MainLayout({children}: Props) {
  return (
    <main className='h-screen bg-zinc-400'>
      <NavBar />
<div>{children}</div>
    </main>
  )
}

export default MainLayout