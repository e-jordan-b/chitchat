import { useLoaderData, Form, NavLink } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div id="dashboard-container" className='border-2 border-red-400 bg-red-200 w-full h-full flex justify-center items-center'>

      <div id="dashboard-content" className="flex flex-col justify-around items-center border border-zinc-700 w-10/12 h-9/10 rounded-lg bg-green-300">

      <div id="top-section" className='flex justify-between items-center w-9/10 h-3/6 bg-indigo-400'>


        <section className='flex flex-col items-center boder-2 bg-slate-500  border-zinc-600 rounded-xl w-12/25 h-9/10'>
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

    <section id="bottom-section" className='flex flex-col items-center boder-2 bg-slate-500 border-zinc-600 rounded-xl w-9/10 h-9/20'>
    <h2 className='mt-5 mb-5 text-3xl'>Previous Calls</h2>
      <div className='bg-slate-500'>
        TODO: add tanstack table + shadcn-ui
        <ul>
          <li>call 1</li>
          <li>call 2</li>
          <li>call 3</li>
        </ul>

      </div>
    </section>
    </div>
  </div>

  )
}
