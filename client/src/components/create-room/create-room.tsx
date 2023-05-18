import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom"
import './create-room.css';
import FullscreenModal from '../fullscreen-modal/fullscreen-modal';
import { useState } from 'react';
import { CgRemove } from 'react-icons/cg'
import RoomService from '../../services/room-service';
import {AiFillCloseCircle} from 'react-icons/ai'
import { UserContext } from '../../user/user-context';
import AuthModal from '../auth/auth-modal';

const CreateRoom: React.FC<{ isVisible: boolean; onClose: () => void }> = ({isVisible, onClose}) => {
  const navigation = useNavigate();
  const [agendaItems, setAgendaItems] = useState<string[] | []>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const roomService = new RoomService();
  const { user } = useContext(UserContext);

  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault();
    if(!input) return;
    const newItems = [...agendaItems];
    newItems.push(input);
    setAgendaItems(newItems);
    setInput('');
  };
  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true)
      console.log(agendaItems);
      // const payload = JSON.stringify({agendaItems});
      const res = await roomService.createRoom(agendaItems);
      console.log(res.url);
      setIsLoading(false);
      navigation(`/room/?url=${res.url}`)
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  const handleRemoveItem  = (index: number) => {
    const newItems = [...agendaItems];
    newItems.splice(index, 1);
    setAgendaItems(newItems);
  };

  if (!isVisible) return null;

  if (!user) {
    return (
      <FullscreenModal>
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="shadow-md h-44 w-96 flex flex-col items-center justify-around bg-white rounded-md relative">

            <p className='select-none'>You must be signed-in to create a new room!</p>

      <div className='absolute top-0 right-0  bg-red w-4 h-4 rounded-full'></div>
      <span
        onClick={() => onClose()}
      className='absolute top-0 right-0 translate-x-[6.5px] cursor-pointer translate-y-[-6.5px]'><AiFillCloseCircle size={25} color='red' /></span>
          </div>
      </div>
      </FullscreenModal>
    )
  }

  return (
    <FullscreenModal>
      <div className='w-full h-screen flex justify-center items-center'>
        <div className={`${isLoading ? "animate-pulse" : null} relative h-[800px] flex flex-col justify-start items-center rounded-md border border-zinc-600 bg-slate-50 dark:bg-gray-800 w-[600px]`}>

          <h3 className='mt-8 mb-4 font-semibold text-4xl dark:text-custom-purple-100'>Set a Meeting Agenda</h3>

              <form className="mt-6 w-[475px]  flex " onSubmit={handleItemSubmit}>
                <input
                  placeholder='describe your meeting topic'
                  className='h-12 w-96 mr-2  p-3  rounded-md shadow-inner self-center bg-custom-purple-100 '
                  type='text'
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  />
                <button
                  className={`text-custom-purple-50 px-2 py-2 ml-1 rounded-md text-lg font-semibold h-12 w-28 ${!input ? "bg-custom-purple-600 dark:bg-custom-purple-800" : "bg-custom-purple-800 dark:bg-custom-purple-600"}`}
                  type='submit'>Add</button>
              </form>



              {agendaItems && agendaItems.length
              ?  <ul className='mt-5 flex flex-col items-start justify-start  overflow-y-auto w-[475px] h-4/6 list-disc [&>*:nth-child(odd)]:bg-custom-purple-100 [&>*:nth-child(odd)]:text-custom-purple-900 [&>*:nth-child(even)]:bg-custom-purple-300 [&>*:nth-child(even)]:text-custom-purple-900'>
                {agendaItems.map((agendaItems, index) => (
                  <li
                  className="text-slate-500 text-lg font-semibold py-1 px-2 mb-2  rounded flex items-center h-12"
                  key={index}>{agendaItems} <button className="text-red-500 ml-2" onClick={() => handleRemoveItem(index)}><CgRemove/></button></li>
                  ))}
              </ul> : <p className="absolute bottom-5 dark:text-custom-purple-100">Please provide topics for your meeting to enhance your summaries.</p>}

              {agendaItems && agendaItems.length ?
              <button
                onClick={handleFinalSubmit}
                className="px-2 py-2 rounded-md text-lg font-semibold bg-custom-purple-600 hover:bg-custom-purple-800 text-white absolute bottom-8 right-8 w-28"
                >Continue
                </button> : null}
              </div>
            </div>
    </FullscreenModal>
  )
};

export default CreateRoom;


