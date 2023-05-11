import { Navigate, useParams, useNavigate} from "react-router-dom"
import { useEffect, useState } from "react"
import { connect } from 'react-redux';

// const { roomId } = useParams()


const LandingPage= () => {
  const [roomId, setRoomId] = useState('645a205090d5f0e0b2b99689');
  const [joinCode, setJoinCode] = useState('');
  const navigation = useNavigate();

  const handleClick = () => {
    // Missing saving code into store / REDUX
    navigation(`/room/${roomId}`);
  };

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
            <button className="bg-slate-600 px-7 py-4 " onClick={handleClick}>Create Call</button>
        </div>

        <div className="flex justify-center items-center border-2 border-gray-300 rounded">
            <input
                className="px-2 py-4 text-left appearance-none"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Join with code"
            />
            <button onClick={handleClick} className="flex justify-center items-center rounded-xl whitespace-nowrap mr-4 transition-all duration-150 h-14 ">Join Call</button>
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