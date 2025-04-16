
"use client"
import {Input} from "@repo/ui/input"

import {Button} from "@repo/ui/button"

export function AuthPage({isSignIn} : {
    isSignIn: boolean
}) {
    return <div  className="h-screen w-screen bg-black flex justify-center items-center">
        <div className="p-4 bg-white rounded-lg">
        <div className="p-2 border">
            <Input placeHolder="Username" variant="primary" size="md"></Input>
        </div>
        <div className="p-2 border"> 
            <Input placeHolder="Password" variant="primary" size="md"></Input>
        </div>
       <div className="flex justify-center p-2">
        <Button onClick={()=> {}} variant={`${isSignIn ? "secondary" : "primary"}`} size="md" text={`${isSignIn ? "Sign in" : "Sign up"}`}></Button>
       </div>
        </div>
        
    </div>
}