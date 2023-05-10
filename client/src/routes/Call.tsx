import { useState } from 'react';
import { NavLink, Form, redirect } from 'react-router-dom';

export default function PreCallScreen(){
  const [roomId, setRoomId] = useState<string>('enter room id');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  }


 return (
  <div className='flex flex-col justify-center items-center'>

  <section className='flex flex-col items-center justify-center boder-2  border-zinc-600  w-12/25 h-9/10 rounded-xl'>
    <div className='flex flex-col items-start justify-center'>
      <NavLink to="/room" className='btn-primary mb-5'>Start a Call</NavLink>
      <Form className='flex'>
        <input defaultValue={roomId} className="flex pl-3 border border-zinc-700 mr-2 rounded-xl" type="text" />
        <button className='btn-secondary' type='submit'>join</button>
      </Form>

      </div>
    </section>
  </div>
  )
}
