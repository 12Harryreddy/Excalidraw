type Variant = "primary" | "secondary"

export interface InputProps {
    variant: Variant,
    size: "sm" | "md" | "lg",
    placeHolder: string,
}

const variantStyle = {
    "primary": "bg-white",
    "secondary": "bg-black"
}

const sizeStyle = {
    "sm" : " py-1 px-2",
    "md" : "py-2 px-4",
    "lg" : "py-4 px-8"   
}


export const Input = (props: InputProps) => {
    return <input placeholder={`${props.placeHolder}`} className={`${variantStyle[props.variant]} ${sizeStyle[props.size]}`} type="text" />
}

