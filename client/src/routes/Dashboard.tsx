import { useLoaderData, Form, NavLink } from 'react-router-dom'
import {useState} from 'react';

export default function Dashboard() {
  const [roomId, setRoomId] = useState<string>('enter room id');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  }

  return (
    <div id="dashboard-container" className='bg-zinc-600 w-full h-full flex justify-center items-center'>

      <div id="dashboard-content" className="flex flex-col justify-around items-center border w-10/12 h-9/10 rounded-lg bg-zinc-300 drop-shadow-lg">

      <div id="top-section" className='flex justify-between items-center w-9/10 h-3/6 '>
      <section className='flex flex-col items-center boder-2 bg-zinc-100 drop-shadow-lg rounded-xl w-12/25 h-9/10'>
      <section className='flex items-center justify-center boder-2  border-zinc-600  w-12/25 h-9/10 rounded-xl'>

    <div className='flex flex-col items-start justify-center'>
      <NavLink to="/room" className='btn-primary mb-5'>Start a Call</NavLink>
      <Form className='flex'>
        <input defaultValue={roomId} onChange={handleInputChange} className="flex pl-3 border border-zinc-700 mr-2 rounded-xl" type="text" />
        <button className='btn-secondary border-2 border-slate-200' type='submit'>join</button>
      </Form>

      </div>
    </section>
        </section>

        <section className='flex flex-col items-center boder-2 bg-zinc-100 drop-shadow-lg rounded-xl w-12/25 h-9/10'>
            <h2 className='mt-5 mb-5 text-3xl'>Last Call</h2>
            <div className='bg-slate-500'>

              <ul>
                <li>TODO: add tanstack table + shadcn-ui</li>
                <li>random fact</li>
                <li>another random fact</li>
                <li>really interesting fact</li>
              </ul>

            </div>
        </section>
    </div>


    </div>
  </div>

  )
}
