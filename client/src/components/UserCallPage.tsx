import { useNavigate} from "react-router-dom"
import { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import useFirebase from '../hooks/useFirebase';
import useAuth from '../hooks/useAuth';
import  { setIsHostTrue, setIsHostFalse, setHasJoinedFalse, setRefreshedFalse } from '../store/slices/videoCallSlice';
// import { useQuery } from '@tanstack/query';

export default function UserCallPage() {

  const {user} = useAuth()
  const dispatch = useDispatch()
  const navigation = useNavigate();
  const [joinCode, setJoinCode] = useState('645a205090d5f0e0b2b99689');
  const refresh = useSelector((state: any) => state.videoCall.hasRefreshed)

  useEffect(() => {
    dispatch(setRefreshedFalse())
  }, [])

  const handleCreateCall = () => {
    dispatch(setIsHostTrue())
    dispatch(setHasJoinedFalse())
    navigation(`/app/call/agenda/`)
  }

  const handleJoinCall = () => {
    dispatch(setIsHostFalse())
    dispatch(setHasJoinedFalse())
    // might be redundant at this point
    if(!joinCode) return
    navigation(`/call/${joinCode}`)
  }

  const handleSignUp = () => {
    // navigation('/signup')
    navigation('/')
  }


  return (

    <div className="flex flex-col justify-center items-center h-screen w-full">
      <div className="w-1/4">
        <div className='mb-5'>
          <h1 className="text-6xl">Lorem ipsum dolor sit amet</h1>
        </div>
        <div>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed molestie iaculis, gravida tempor vestibulum accumsan vitae nostra massa
            gravida tempor vestibulum accumsan vitae nostra massa
          </p>
        </div>
      </div>

      <div className= "flex justify-between items-center w-[450px] mt-16">

      <div className="text-white flex justify-center items-center">
        <button className="bg-slate-600 px-7 py-4 " onClick={handleCreateCall}>Create Call</button>
      </div>



        <div className="flex justify-between items-center border-2 border-gray-300 rounded">
            <input
                className="px-2 py-4 text-left appearance-none"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Join with code"
            />
            <button onClick={handleJoinCall} className=" ml-2 flex justify-center items-center rounded-xl  border-l border-gray-600 mr-4 h-14 ">Join Call</button>
        </div>
      </div>
    </div>
  )
};

// export default LandingPage;

//? is this doing anything?
interface state {
  joinCode: string
};

const mapStateToProps = (state:state) => {
  return { joinCode: state.joinCode };
};

const mapDispatchToProps = (dispatch:Function) => {
  return {
    add: () => dispatch({ type: 'ADD' }),
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
