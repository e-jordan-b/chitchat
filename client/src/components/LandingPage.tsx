import { useNavigate} from "react-router-dom"
import { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import useFirebase from '../hooks/useFirebase';


import  { setIsHostTrue, setIsHostFalse, setHasJoinedFalse, setRefreshedFalse } from '../store/slices/videoCallSlice';

const LandingPage = () => {
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

    //TODO generate room id from firebase (or uuid? still unclear)
    // const { db } = useFirebase() //TODO: use this to generate room id?
    //!make post request to localhost:3001/room
    // wait for response
    // fail gracefully if needed
    // navigate to /call/:callId

    navigation(`/call/${joinCode}`)
   }

   const handleJoinCall = () => {
     dispatch(setIsHostFalse())
    dispatch(setHasJoinedFalse())

    if(!joinCode) return
    navigation(`/call/${joinCode}`)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
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
      <div className= "flex justify-between items-center w-1/4 mt-16">
        <div className="text-white flex justify-center items-center">
            <button className="bg-slate-600 px-7 py-4 " onClick={handleCreateCall}>Create Call</button>
        </div>

        <div className="flex justify-center items-center border-2 border-gray-300 rounded">
            <input
                className="px-2 py-4 text-left appearance-none"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Join with code"
            />
            <button onClick={handleJoinCall} className="flex justify-center items-center rounded-xl whitespace-nowrap mr-4 transition-all duration-150 h-14 ">Join Call</button>
        </div>
      </div>
    </div>
  )
};

// export default LandingPage;
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

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);