
"use client";
export function AuthPage({isSignIn} : {isSignIn: boolean}) {
   return  <div className="h-screen w-screen flex justify-center items-center bg-black rounded-2xl">
        <div className="p-6 bg-white">
            <div className="p-2">
            <input type="text" placeholder="username"/>
            </div>
            <div className="p-2">
            <input type="text" placeholder="Password"></input>
            </div>
           <div className="p-2 flex justify-center items-center bg-green-500 rounded-2xl">
           <button className=" bg-green-500" >Submit</button>
           </div>
        </div>
    </div>
}