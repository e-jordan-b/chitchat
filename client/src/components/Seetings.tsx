import React from 'react'

interface SettingsProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>
}

export default function Seetings(props: SettingsProps) {
  return (
    <div className = 'flex justify-center items-center h-screen'>
      <button onClick={() => props.setCurrentPage('call')}>Join</button>
    </div>
  )
}
