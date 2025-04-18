"use client"

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./icons";
import { Camera, Circle, Pencil, RectangleEllipsis, RectangleHorizontal } from 'lucide-react';

type Shape = "Circle" | "Pencil" | "Rectangle"

    export default function Canvas({roomId, socket} : {roomId: string, socket: WebSocket})  {
        const [toolState, setToolState] = useState<Shape>("Rectangle")
        const canvasRef = useRef<HTMLCanvasElement>(null);
        
        useEffect(() => {
            // @ts-ignore
            window.selectedTool = toolState
        }, [toolState]) 

        useEffect(()=> {
        if(canvasRef.current ) {
            initDraw(canvasRef.current, roomId, socket);
        }
        }   , [canvasRef])

        return <div style={{height:"100%",width: "100%" ,overflow:"hidden"}}>
        <canvas  ref={canvasRef} width={window.innerWidth} height={window.innerHeight}> </canvas>
        <Topbar selectedTool={toolState} setSelectedTool={setToolState}/>
        </div>
    } 

    function Topbar({selectedTool, setSelectedTool}: {
        selectedTool: Shape,
        setSelectedTool: (s: Shape) => void
    }) {
        return <div className="flex fixed top-3 left-4 gap-1">
        <IconButton  icon={<Pencil color={`${selectedTool == "Pencil" ? "red" : "white"}`}/>} onClick={() => {setSelectedTool("Pencil")}}></IconButton>
        <IconButton icon={<Circle color={`${selectedTool == "Circle" ? "red" : "white"}`}/>} onClick={() => {setSelectedTool("Circle")}}></IconButton>
        <IconButton icon={<RectangleHorizontal color={`${selectedTool == "Rectangle" ? "red" : "white"}`}/>} onClick={() => {setSelectedTool("Rectangle")}}></IconButton>
        </div>
    }