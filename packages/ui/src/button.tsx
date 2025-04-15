"use client";
import { ReactElement, ReactNode } from "react";

type variant = "primary" | "secondary" | "outline"

interface ButtonProps {
  variant: variant,
  size: "sm" | "md" | "lg",
  text: string,
  startIcon?: ReactElement,
  endIcon?: ReactElement,
  onClick?: () => void,
  loading? : boolean
}

const variantStyles = {
  "primary": "bg-[#91766E] text-white",
  "secondary": "bg-[#87A7A9] text-black",
  "outline": "bg-[#F6ECE3] text-[#91766E] border-1 border-black"
}

const sizeStyles = {
  "sm": "py-1 px-2 text-sm rounded-sm ",
  "md": "py-2 px-4 text-md rounded-md",
  "lg": "py-4 px-8 text-lg rounded-lg"
}

export const Button = (props: ButtonProps) => {
  return (
    <button onClick={props.onClick} className={`${variantStyles[props.variant]} ${sizeStyles[props.size]} ${props.loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} "m-2"`} >
      <div className="flex p-2 items-center gap-2">
        {props.startIcon}
      {props.loading ? `loading...` : `${props.text}`}
        {props.endIcon}
      </div>
    </button>
  );
};
