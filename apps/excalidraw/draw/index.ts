

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
    radiusX: number,
    radiusY: number
} | {
    type: "Pencil",
    startX: number,
    startY: number,
    endX: number,
    endY: number
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
           
            let shape : Shape | null = null;
            // @ts-ignore
            const selectedTool = window.selectedTool;
            if(selectedTool == "Rectangle") {
                const width = e.clientX - startX;
                const height = e.clientY -  starty;
                shape= {
                    type: "Rectangle",
                    startX: startX,
                    startY: starty,
                    width: width,
                    height: height
                }
            } 
            if(selectedTool == "Circle") {
                const centerX = (startX + e.clientX)/2;
                const centerY = (starty + e.clientY) / 2;
                const radiusX = Math.abs(startX - e.clientX);
                const radiusY = Math.abs(starty - e.clientY);
                shape = {
                    type: "Circle",
                    centerX: centerX,
                    centerY: centerY,
                    radiusX: radiusX,
                    radiusY: radiusY
                }
            }
            if(!shape) return;
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
                // @ts-ignore
                const selectedTool = window.selectedTool;
                if(selectedTool == "Rectangle") {
                    const width = e.clientX - startX;
                    const height = e.clientY -  starty;
                    clearCanvas(shapes,ctx, canvas);
                    ctx?.strokeRect(startX, starty, width, height);
                } 
                
                if(selectedTool == "Circle") {
                    const centerX = (startX + e.clientX)/2;
                    const centerY = (starty + e.clientY) / 2;
                    const radiusX = Math.abs(startX - e.clientX);
                    const radiusY = Math.abs(starty - e.clientY);
                    clearCanvas(shapes,ctx,canvas);
                    ctx.beginPath()
                    ctx.ellipse(centerX,centerY, radiusX, radiusY, 0,0, 2 * Math.PI);
                    ctx.strokeStyle = ("rgba(255,255,255)");
                    ctx.stroke();
                }
                
            }
        })                
}

function clearCanvas(shapes: Shape[], ctx: CanvasRenderingContext2D, canva: HTMLCanvasElement) {
    ctx.clearRect(0,0,canva.width,canva.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canva.width, canva.height)
    ctx.strokeStyle = "rgba(255,255,255)";
    shapes.map((shape) => {
        if(shape.type == "Rectangle") {
            
            ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        } 
        if(shape.type == "Circle") {
            ctx.beginPath()
            ctx.ellipse(shape.centerX,shape.centerY,shape.radiusX,shape.radiusY, 0,0, 2 * Math.PI);
            ctx.stroke();
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