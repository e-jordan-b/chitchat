
import { useLoaderData } from 'react-router-dom'
// import { getContact } from '../contacts'

// ⬇️ this is the loader for the detail route
export async function loader({ params }: { params: { contactId: string } }) {
  // return getContact(params.contactId)
  return  { id: 1, name: "John" }
}

export default function Contact() {
  // ⬇️ this gives you data from the loader
  const contact = useLoaderData()
  // render some jsx
}