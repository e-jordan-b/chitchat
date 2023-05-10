
import { useNavigation } from 'react-router-dom'
import { useState } from "react"

export default function Conversations() {
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
    </div>
  )
}
