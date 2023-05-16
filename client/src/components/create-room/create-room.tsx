import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom"
import './create-room.css';
import FullscreenModal from '../fullscreen-modal/fullscreen-modal';
import { useState } from 'react';
import { CgRemove } from 'react-icons/cg'
import RoomService from '../../services/room-service';
import {AiFillCloseCircle} from 'react-icons/ai'
import { UserContext } from '../../user/user-context';


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

            <p>You must be signed-in to create a new room!</p>
            <div className='absolute top-0 right-0 translate-x-[2px] translate-y-[-1px] bg-white w-3 h-3 rounded-full'></div>
      <span
        onClick={() => onClose()}
      className='absolute top-0 right-0 translate-x-[8px] translate-y-[-8px]'><AiFillCloseCircle size={25} color='red' /></span>
          </div>
      </div>
      </FullscreenModal>
    )
  }

  return (
    <FullscreenModal>
      <div className='w-full h-screen flex justify-center items-center'>
        <div className={`${isLoading ? "animate-pulse" : null} relative h-3/5 flex flex-col justify-start items-center rounded-md border border-zinc-600 bg-slate-50 w-[600px]`}>
          <h3 className='mt-6 mb-4 font-semibold text-4xl'>Set a Meeting Agenda</h3>

              <form className="mt-6 w-[475px] flex " onSubmit={handleItemSubmit}>
                <input
                  className='h-12 w-96 rounded-md mr-2 border border-1 p-3 border-2 rounded-md shadow-inner self-center shadow-lg shadow-inner'
                  type='text'
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  />
                <button
                  className={`px-2 py-2 border rounded-md text-lg font-semibold h-12 w-28 ${!input ? "bg-custom-purple-400" : "bg-custom-purple-500"}`}
                  type='submit'>Add Topic</button>
              </form>
              {agendaItems && agendaItems.length ?  <ul className='mt-5 flex flex-col items-start justify-start overflow-auto w-[475px] list-disc [&>*:nth-child(odd)]:bg-zinc-100 [&>*:nth-child(even)]:bg-zinc-300'>
                {agendaItems.map((agendaItems, index) => (
                  <li
                  className="text-slate-500 text-lg font-semibold py-1 px-2 mb-2  rounded flex items-center h-12"
                  key={index}>{agendaItems} <button className="text-red-500 ml-2" onClick={() => handleRemoveItem(index)}><CgRemove/></button></li>
                  ))}
              </ul> : <p className="absolute bottom-5">Please provide topics for your meeting to enhance your summaries.</p>}
              {agendaItems && agendaItems.length ?
              <button
                onClick={handleFinalSubmit}
                className="px-2 py-2 border rounded-md bg-custom-purple-400 text-white absolute bottom-8 right-8 w-24"
                >Continue
                </button> : null}
              </div>
            </div>
    </FullscreenModal>
  )
};

export default CreateRoom;


