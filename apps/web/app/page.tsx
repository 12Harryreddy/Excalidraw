"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#000000",
      width:"100vw",
      height:"100vh",
      margin:"0px",
      
    }}>
      <input  value={roomId} type="text" placeholder="Room Id" onChange={(e) => {
        setRoomId(e.target.value);
      }} />
      <button onClick={() => {
        router.push(`/room/${roomId}`);
      }}>Join Room</button>
    </div>
  );
}
