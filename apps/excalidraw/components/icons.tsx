import { ReactNode } from "react";




export default function IconButton({icon, onClick}: {icon: ReactNode, onClick: () => void }) {
    
    return <div onClick={onClick} className="p-3 pointer rounded-2xl  bg-gray-800 opacity-65 hover:bg-slate-900 hover:opacity-60">
        {icon}
    </div>

}


