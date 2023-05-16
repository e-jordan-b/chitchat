import { AiFillAudio, AiFillPhone } from 'react-icons/ai';
import { BiVideo } from 'react-icons/bi';

const RoomCallControls = () => {
  return (
    <div className="bottom-0 w-1/2 h-24 bg-background-black-call m-0 flex text-white items-center justify-center">
      <div className="sidebar-icon">
        <AiFillAudio size={'20'} />
      </div>
      <div className="sidebar-icon bg-red-600 hover:bg-red-400 hover:text-white">
        <AiFillPhone size={'25'} />
      </div>
      <div className="sidebar-icon">
        <BiVideo size={'25'} />
      </div>
    </div>
  );
};

export default RoomCallControls;
