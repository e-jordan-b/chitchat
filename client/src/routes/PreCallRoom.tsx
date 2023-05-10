import {useParams} from 'react-router-dom';

export default function PreCallRoom() {

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl mb-3" >PreCallRoom</h1>
      <h1 className="text-2xl mb-3" >camera preview</h1>
      <h1 className="text-2xl mb-3" >settings for mic and cam</h1>
      <h1 className="text-2xl mb-3" >force user to enter a name</h1>
      <button className="btn-primary w-60 text-2xl">join call button that redirects to staging?</button>
      <a className="btn-primary w-60 text-2xl mt-5" href="https://github.com/dinoDonga/cc-playground/blob/main/src/app/videoCall/page.tsx">check example for device preview</a>
    </div>

  )
}
