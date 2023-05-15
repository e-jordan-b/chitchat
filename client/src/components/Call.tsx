import {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Start() {
const navigate = useNavigate();
const [joinCode, setJoinCode] = useState<string>('')

  const handleCreateClick = () => {
    navigate('/settings')
  }

  const handleJoinClick = () => {
    if(!joinCode) return console.error('no join code entered')
    navigate(`/settings/${joinCode}`)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.target.value);
  };

  return (
    <div className='flex justify-center items-center h-screen'>

      <div className='flex flex-col items-start'>

      <button
          onClick={handleCreateClick}
          className='mb-5 rounded-md border border-black px-5 py-2 bg-blue-500 text-white'
          >
          create
          </button>

      <div>
        <input
        onChange={handleCodeChange}
          defaultValue={joinCode}
          className="h-10 border border-black rounded-md"type="text"
          />
          <button
            onClick={handleJoinClick}
            className="mb-5 rounded-md border border-black px-5 py-2 bg-green-500 text-white"
            >
            join
            </button>
      </div>
          </div>

    </div>
  )
}
