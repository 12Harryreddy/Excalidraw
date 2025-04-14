

import { useEffect, useState } from "react";
import { WS_URL } from "../config";


export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(()=> {
        const ws = new WebSocket(WS_URL + "?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjYTAzNjY5Ni1jNDVmLTRhMTktODcwYy02M2RhZWIyMDQ4YTQiLCJpYXQiOjE3NDQ1NTM4NTl9.sXLy7g7o84ycQes-KF4jXAV3d5YJsws0mbQlTiOU-Tg");
        ws.onopen = ()=> {
            setLoading(false);
            setSocket(ws);
        }
    }, []); 

    return {
        socket, 
        loading
    }

}