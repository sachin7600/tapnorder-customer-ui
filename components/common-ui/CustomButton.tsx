"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {MoveRight, ShoppingCart} from "lucide-react";

interface CustomButtonProps {
    count?: number;
    label?: string;
    onClick?: () => void;
    iconSize?: number;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       count = 0,
                                                       label = "View Order",
                                                       onClick,
                                                       iconSize = 24,
                                                       disabled = false,
                                                   }) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className="w-full py-6 rounded-md flex justify-between items-center px-2 bg-primary transition-all"
        >
            <span
                className="text-sm font-semibold text-primary bg-white rounded-lg w-20 py-2 text-center flex justify-around items-center">
                <ShoppingCart size={5}/>
                <span>
                    {count} {count > 1 ? "Items" : "Item"}
                </span>
              </span>

            <span className="flex gap-1 items-center">
                <span className="text-lg font-semibold text-white">{label}</span>
                <MoveRight size={iconSize} className="text-white"/>
              </span>
        </Button>
    );
};

export default CustomButton;
