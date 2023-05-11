import { useState } from "react"
import { useNavigate} from "react-router-dom"
import { collection, doc } from 'firebase/firestore'
import useFirebase from '../hooks/useFirebase';
import { useDispatch,  } from 'react-redux'
import  { toggleIsHost } from '../store/slices/videoCallSlice';

const PreCall = () => {
  const dispatch = useDispatch()
  const [joinId, setJoinId] = useState('645a205090d5f0e0b2b99689')
  const { db } = useFirebase()

  const navigation = useNavigate()

  const handleCreateCall = () => {
    dispatch(toggleIsHost())
    const { id } = doc(collection(db, "calls"));
    setJoinId(id)
    //  const id = '645a205090d5f0e0b2b99689'
    navigation(`/call/${id}`)
   }


  // const handleJoinIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setJoinId(e.target.value)
  // }


  const handleJoinCall = () => {

    if(!joinId) return
    navigation(`/call/${joinId}`)
  }




  return (

    <div className="home">
      <div className='bg-green-500 text-white p-1 rounded-md w-24 flex items-center justify-center'>
          <button onClick={handleCreateCall}>Start Call</button>
      </div>
      <div className="answer box">
          <input className="p-1 border border-gray-500 rounded-md" defaultValue={joinId} />
          <button className='bg-cyan-500 text-white p-1 rounded-md w-24' onClick={handleJoinCall}>Answer</button>
      </div>
      <p>{joinId}</p>
    </div>
  )
}

export default PreCall