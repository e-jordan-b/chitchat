
import { useNavigation, useLoaderData } from 'react-router-dom'
// import { useState } from "react"
import { useQuery } from "@tanstack/react-query";


const getFakeData = () => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { id: 1, started: "2020-05-09 03:22:58", ended: "2020-05-09 03:25:58",name: "John", body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate ullam esse voluptates, excepturi hic molestiae blanditiis ", summary: ["mimmimii", "mumumumum", "mamamamam", "memememem"]},
    { id: 2, started: "2022-03-31 18:39:42", ended: "2022-03-31 18:59:42",name: "Jane", body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate ullam esse voluptates, excepturi hic molestiae blanditiis ", summary: ["mimmimii", "mumumumum", "mamamamam", "memememem"]},
    { id: 3, started: "2021-02-01 05:28:01", ended: "2021-02-01 01:28:01",name: "Jack", body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate ullam esse voluptates, excepturi hic molestiae blanditiis ", summary: ["mimmimii", "mumumumum", "mamamamam", "memememem"]},
    { id: 4, started: "2022-01-25 07:42:23", ended: "2022-01-25 08:22:23",name: "John", body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate ullam esse voluptates, excepturi hic molestiae blanditiis ", summary: ["mimmimii", "mumumumum", "mamamamam", "memememem"]},
  ]
}


export type ConversationType = {
  id: string,
  started: string,
  ended: string,
  name: string,
  body: string
}


export async function loader() {
  const conversations = await getFakeData();
  return { conversations };
}

// export const loader =
//   (queryClient) =>
//   async ({ params }) => {
//     const query = contactDetailQuery(params.contactId);
//     return (
//       queryClient.getQueryData(query.queryKey) ??
//       (await queryClient.fetchQuery(query))
//     );
//   };




export default function Conversations() {
  const navigation = useNavigation();
  const {conversations} = useLoaderData() as {conversations: ConversationType[]}

  return (
    <div className={`flex flex-col justify-center items-center ${ navigation.state === "loading" ? "opacity-25 transition delay-200" : null}`}>
    <div>Conversations</div>
    <h1>TODO: big table with all conversations filterable tanstack/table + shadcnui</h1>
    <h3 className='mb-5'>Click on conversation goes to conversation edit route </h3>
    <div>
      {conversations.map((conversation) => {
        return (
          <div className="flex" key={conversation.id}>

            <div className="mr-5">{conversation.name}</div>
            <div className='truncate w-40'>{conversation.body}</div>
          </div>
        )
      })
      }
    </div>
    </div>
  )
}
