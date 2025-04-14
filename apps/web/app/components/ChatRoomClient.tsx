"use client"

import { useEffect, useRef, useState } from "react"
import { useSocket } from "../hooks/useSocket";




export function ChatRoomClient({
    messages,
    id
} : {
    messages: {message: string}[],
    id: string
}) {
    const [chats, setChats] = useState(messages);
    const {socket, loading} = useSocket();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=> {
        if(socket && !(loading)) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat") {
                    setChats(c => [...c, {message:parsedData.message}]);
                }

            }
        }
    }, [socket, loading, id])

    return <div>
        {chats.map(c => {
            return <div>{c.message}</div>
        })}
        <input ref={inputRef} type="text" placeholder="type your message..." />
        <button onClick={ () => {
             socket?.send(JSON.stringify({
                "type": "chat",
                "message": inputRef.current?.value,
                "roomId": id
            }))
            if (inputRef.current) {
                inputRef.current.value = "";
              }
        }
        }>Send</button>
    </div>
}