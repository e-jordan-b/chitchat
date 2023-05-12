import { useNavigate, useParams} from "react-router-dom"
import { useState } from 'react';

export default function AgendaCreationScreen() {
    const { callId } = useParams()
    console.log(callId)
    const navigation = useNavigate();


    const [items, setItems] = useState<string[] | []>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);


    const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>)  => {
      e.preventDefault();
      if(!input) return;
      const newItems = [...items];
      newItems.push(input);
      setItems(newItems);
      setInput('');

    };

    const handleFinalSubmit = async () => {
      // const response = await fetch('/api/submit', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ items })
      // });
      // const data = await response.json();
      // console.log(data);

      console.log(items);

      setItems([]);
      navigation(`/call/${callId}`)
    };

    const handleRemoveItem  = (index: number) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    };


    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <div className="relative h-[512px] flex flex-col justify-start items-center rounded-md border border-zinc-600 w-[600px]">

        <button
          onClick={handleFinalSubmit}
          className="px-2 py-2 border rounded-md bg-green-500 text-white absolute top-3 right-3 w-24"
          >{items && items.length ? "Continue" : "Skip"}
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


        {items && items.length ?  <ul className='mt-5 flex flex-col items-start justify-start overflow-auto w-[475px] list-disc [&>*:nth-child(odd)]:bg-zinc-100 [&>*:nth-child(even)]:bg-zinc-300'>
          {items.map((item, index) => (
            <li
            className="text-blue-500 py-1 px-2 mb-2  rounded "

            key={index}>{item} <button className="text-red-500 ml-2" onClick={() => handleRemoveItem(index)}>X</button></li>
            ))}
        </ul> : <p className="absolute bottom-5">Tipp: providing an agenda can lead to better summary results.</p>}



            </div>
      </div>
    );
  }


//
//
