import axios from "axios"
import { BACKEND_URL } from "../../config"
import { ChatRoomComponent } from "../../components/ChatRoomComponent";





async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id
}

export default  async function Page({params} : {params: Promise<{slug: string}>}) {

    const slug = (await params).slug
    const roomId = await getRoomId(slug);
    return <ChatRoomComponent id={roomId}></ChatRoomComponent>

}

