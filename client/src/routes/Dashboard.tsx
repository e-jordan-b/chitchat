import { useLoaderData } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className='border-2 border-red-400 bg-red-200 w-full h-full flex flex-col justify-center items-center'>

      <div className="flex justify-around items-center border border-zinc-700 w-11/12 h-9/10 rounded-lg bg-green-300">

        <section className='flex flex-col items-center justify-center boder-2 bg-slate-500  border-zinc-600 w-2/5 h-4/6 rounded-xl'>

             <button className='primary-btn'>Start a new Call</button>
             <label htmlFor="join-call">join a call</label>
             <input className="border border-zinc-700"type="text" />
        </section>

        <section className='flex flex-col items-center boder-2 bg-slate-500  border-zinc-600 w-2/5 h-4/6 rounded-xl'>

            <h4>Previous Calls</h4>
            <div className='bg-slate-500'>
              TODO: add tanstack table + shadcn-ui
            </div>

        </section>

       </div>
      </div>

  )
}
