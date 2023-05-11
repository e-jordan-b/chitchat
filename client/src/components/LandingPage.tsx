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
    <div className="flex flex-row justify-center items-center h-screen ">
        <div className="create box mr-10 ">
            <button className="bg-slate-400 p-5" onClick={handleClick}>Create Call</button>
        </div>

        <div className="answer box">
            <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Join with code"
            />
            <button onClick={handleClick}>Answer</button>
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