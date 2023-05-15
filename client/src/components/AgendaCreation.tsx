import { useNavigate } from "react-router-dom"
import { useState } from 'react';
import { CgRemove } from 'react-icons/cg'
import axios from 'axios';

export default function AgendaCreation() {
    const navigation = useNavigate();

    const [agendaItems, setAgendaItems] = useState<string[] | []>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        const payload = JSON.stringify({agendaItems});
        const res = await axios('http://localhost:3001/room/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: payload,
          withCredentials: true,
        });

        console.log({res});

        setIsLoading(false);
        navigation(`/room/${res.data.url}`)

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


    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <div className={`${isLoading ? "animate-pulse" : null} relative h-[512px] flex flex-col justify-start items-center rounded-md border border-zinc-600 w-[600px]`}>

        <button
          onClick={handleFinalSubmit}
          className="px-2 py-2 border rounded-md bg-green-500 text-white absolute top-3 right-3 w-24"
          >{agendaItems && agendaItems.length ? "Continue" : "Skip"}
          </button>

        <h3 className='mt-6 font-semibold text-4xl'>Agenda</h3>

        <form className="mt-6 w-[475px]" onSubmit={handleItemSubmit}>
          <input
            className='h-12 w-96 rounded-md mr-2 bg-zinc-300 border border-1 border-gray-500 p-3'
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            />
          <button
          className={`px-2 py-2 border rounded-md  text-white h-12 ${!input ? "bg-blue-300" : "bg-blue-500"}`}
          type='submit'>Add Item</button>
        </form>


        {agendaItems && agendaItems.length ?  <ul className='mt-5 flex flex-col items-start justify-start overflow-auto w-[475px] list-disc [&>*:nth-child(odd)]:bg-zinc-100 [&>*:nth-child(even)]:bg-zinc-300'>
          {agendaItems.map((agendaItems, index) => (
            <li
            className="text-blue-500 py-1 px-2 mb-2  rounded flex items-center "

            key={index}>{agendaItems} <button className="text-red-500 ml-2" onClick={() => handleRemoveItem(index)}><CgRemove/></button></li>
            ))}
        </ul> : <p className="absolute bottom-5">Tipp: providing an agenda can lead to better summary results.</p>}



            </div>
      </div>
    );
  }