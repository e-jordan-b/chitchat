
import { useNavigation } from 'react-router-dom'
import { useState } from "react"



import { useLoaderData } from 'react-router-dom'
// import { getContact } from '../contacts'

// ⬇️ this is the loader for the detail route
export async function loader({ params }: { params: { contactId: string } }) {
  // return getContact(params.contactId)
  return  { id: 1, name: "John" }
}

export type ConversationType = {
  id: string,
  name: string,
  body: string

}


export default function Conversations() {
  const conversations = useLoaderData() as ConversationType[]
  const navigation = useNavigation();
  // const [navigation, setNavigation] = useState({state: "loading"})
  // const toggleNavigation = () => {
  //   if (navigation.state === "loading") {
  //     setNavigation({state: "loaded"})
  //   } else {
  //     setNavigation({state: "loading"})
  //   }
  // }


  return (
    <div className={`flex flex-col justify-center items-center ${ navigation.state === "loading" ? "opacity-25 transition delay-200" : null}`}>
    {/* <button onClick={toggleNavigation}>toggle Loading State</button> */}
    <div>Conversations</div>
    <div>
      {conversations.map((conversation: ConversationType) => {
        return (
          <div key={conversation.id}>
            <div>{conversation.name}</div>
            <div>{conversation.body}</div>
          </div>
        )
      })
      }
    </div>
    </div>
  )
}
