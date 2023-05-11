import { Navigate, useParams, useNavigate} from "react-router-dom"
import { useEffect, useState } from "react"
// const { roomId } = useParams()


const CreateCall = () => {
  const [roomId, setRoomId] = useState('645a205090d5f0e0b2b99689')

  const navigation = useNavigate()


  const handleJoinCall = () => {
    navigation(`/room/${roomId}`)
  //  < Navigate to=`room/${roomId}/>
  }

  const handleCreateCall = () => {

  }
  return (
    // CreateCAll button
    // Join call input
    // On CreateCall click establich connection to fireabase/RTC
    <div className="home">
      <div className="create box">
          <button onClick={handleCreateCall}>Create Call</button>
      </div>

      <div className="answer box">
          <input defaultValue={roomId} />
          <button onClick={handleJoinCall}>Answer</button>
      </div>
    </div>
  )
}

export default CreateCall