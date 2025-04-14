import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChatRoomClient } from "./ChatRoomClient";


async function getMessages(id:string) {
    console.log("in gemessage fucntionm")
    const response = await axios.get(`${BACKEND_URL}/chats/${id}`);
    console.log("after gemessage fucntionm")
    console.log(response.data.message)
    return response.data.messages;
}

export async function ChatRoomComponent({id}: {id: string}) {
    const messages = await getMessages(id);
    return <ChatRoomClient id={id} messages={messages} ></ChatRoomClient>
}