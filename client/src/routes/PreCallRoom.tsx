import {useParams} from 'react-router-dom';

export default function PreCallRoom() {
  let { callId } = useParams();

  return (
    <div>PreCallRoom
       <p>{callId}</p>
    </div>

  )
}
