import React from "react"
import './call.css'

interface menuProps {
  joinCode: string,
  setPage: React.Dispatch<React.SetStateAction<string>>,
  setJoinCode: React.Dispatch<React.SetStateAction<string>>
}

const Menu: React.FC<menuProps> = ({joinCode, setPage, setJoinCode}: menuProps) => {
  return (
    <div className="home">
        <div className="create box">
            <button onClick={() => setPage("create")}>Create Call</button>
        </div>

        <div className="answer box">
            <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Join with code"
            />
            <button onClick={() => setPage("join")}>Answer</button>
        </div>
    </div>
  );
}

export default Menu
