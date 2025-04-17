"use client"

import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react";
import Canvas from "./canvas";




export default function RoomCanvas({roomId}: {roomId: string}) {

    const [socket, setSocket] = useState<WebSocket | null>(null);


    useEffect(() => {
        const ws = new WebSocket(WS_URL+  "?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZjU3OGJhYy02OGIyLTQ4ZWMtYjA5ZS0xNTdiMWQwZTBkMDEiLCJpYXQiOjE3NDQ4MjIxODB9.tZfeuTyo14gLPGHZwMMIZhZ3a-rcqHDcJJpG5t-b8yo");
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }
       
    },[])
    if(!socket) {
        return <div>
            loading...
        </div>
    }
    return <Canvas roomId={roomId} socket={socket}></Canvas>
    
}
