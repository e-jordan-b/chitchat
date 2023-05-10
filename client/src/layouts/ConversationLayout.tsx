import { Outlet } from 'react-router-dom'

// fetch conversation from cached conversations with react query

export default function ConversationLayout() {
  return (

    <section>
      <h1>Conversation Layout</h1>
      <Outlet/>
    </section>
  )
}
