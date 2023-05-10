import { Outlet } from 'react-router-dom'

// fetch conversation from cached conversations with react query

export default function ConversationLayout() {
  return (
    <section><Outlet/></section>
  )
}
