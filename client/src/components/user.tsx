import React, { FC } from "react";

interface UserProps {
  children: any
}

const User: React.FC<UserProps> = (props: UserProps) => {
  return (
    <div>{props.children}</div>
  )
}

export default User