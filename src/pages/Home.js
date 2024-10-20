import { React, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { userInfo } = useContext(UserContext);

  return (
    <div>
      {userInfo && userInfo.member ? ( // userInfo와 member가 있는 경우
        <h1>환영합니다, {userInfo.member.name}님!</h1>
      ) : (
        <p>Home</p> // userInfo나 member가 없으면 Home
      )}
    </div>
  );
}
