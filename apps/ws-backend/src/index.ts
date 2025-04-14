import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"
import { parsePath } from "react-router-dom";
import {prismaClient} from "@repo/db/client"
const wss = new WebSocketServer({port: 8080});

function checkToken(token: string) : string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof decoded == "string") {
            return null;
        }
        if(!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId
    } catch (err) {
        return null;
    }
    return null;
}

interface Users {
    ws: WebSocket,
    rooms: string[],
    userId: string
}
const users : Users[] = []; 

wss.on("connection", function connection(ws, req) {

    const url = req.url
    if(!url) return
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkToken(token)
    if(!userId) {
        ws.close()
        return null
    }


    users.push({
        userId,
        ws,
        rooms: []
    })

    ws.on('message', async function message(data) {
        const parsedData = JSON.parse(data as unknown as string);

        if(parsedData.type === "join_room") {
            const user = users.find(user => (user.ws === ws) );
            user?.rooms.push(parsedData.roomId);

        }

        if(parsedData.type === "leave_room") {
            const user = users.find(user => (user.ws === ws) );
            if(!user) return;
            user.rooms = user.rooms.filter(x=> x !== parsedData.roomId);

        }

        if(parsedData.type === "chat") {
            const roomId = parsedData.roomId 
            const message = parsedData.message
            console.log(typeof roomId)
            await prismaClient.chat.create({
                data: {
                    roomId,
                    message,
                    userId,
                }
            })
            users.forEach(user => {
                if(user.rooms.includes(roomId as string)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message,
                        roomId
                    }))
                }
            })
        }




    });
});