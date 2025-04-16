

import { BACKEND_URL } from "@/app/config";
import axios from "axios"

type Shape = {
    type: "Rectangle",
    startX: number,
    startY: number,
    width: number,
    height: number
}  | {
    type: "Circle",
    centerX: number,
    centerY: number,
    radius: number
};

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    
        const ctx = canvas.getContext("2d");
        const shapes: Shape[] = await getExistingShapes(roomId);
        if(!ctx) return ;
        

        
        socket.onmessage = (event) => {
    
            const message = JSON.parse(event.data);
            console.log(message)
            if(message.type == "chat") {
                const parsedData = JSON.parse(message.message);
                shapes.push(parsedData.shape)
                clearCanvas(shapes,ctx, canvas);
            }
        }
        clearCanvas(shapes,ctx, canvas);

        ctx.strokeStyle = "rgba(255,255,255)"
        ctx.fillStyle = "rgba(0,0,0)";

        ctx.strokeStyle = "rgba(255,255,255)"
        let isClicked = false;
        let startX = 0;
        let starty = 0;
        canvas.addEventListener("mousedown", (e) => {
        isClicked = true
        startX = e.clientX
        starty = e.clientY
        })

        canvas.addEventListener("mouseup", (e) => {
            isClicked = false
            const width = e.clientX - startX;
            const height = e.clientY -  starty;
            const shape : Shape= {
                type: "Rectangle",
                startX: startX,
                startY: starty,
                width: width,
                height: height
            };
            shapes.push(shape)
            socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({shape}),
                    roomId: roomId
                }
            ))
        })

        canvas.addEventListener("mousemove", (e) => {
            if(isClicked) {
                const width = e.clientX - startX;
                const height = e.clientY -  starty;
                clearCanvas(shapes,ctx, canvas);
                ctx?.strokeRect(startX, starty, width, height);
            }
        })                
}

function clearCanvas(shapes: Shape[], ctx: CanvasRenderingContext2D, canva: HTMLCanvasElement) {
    ctx.clearRect(0,0,canva.width,canva.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canva.width, canva.height)

    shapes.map((shape) => {
        if(shape.type == "Rectangle") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        }
    })
    
}

async function getExistingShapes(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = response.data.messages
    const shapes = messages.map((x: {message: string}) => {
        const parsedData = JSON.parse(x.message);
       return parsedData.shape
    })
    return shapes
}