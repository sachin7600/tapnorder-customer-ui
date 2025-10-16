"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {MoveRight, ShoppingCart} from "lucide-react";
import Image from "next/image";

interface CustomButtonProps {
    count?: number;
    label?: string;
    onClick?: () => void;
    iconSize?: number;
    disabled?: boolean;
    classNames?: string;
    icon?: any
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       count = 0,
                                                       label = "View Order",
                                                       onClick,
                                                       iconSize = 24,
                                                       disabled = false,
                                                      classNames="",
                                                        icon
                                                   }) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-6 rounded-md flex justify-between items-center px-2 bg-primary transition-all ${classNames}`}
        >
          {
            icon ? (
              <span
                className="text-sm font-semibold text-primary bg-white rounded-lg w-12 py-2 flex justify-center itmes-center"
              >
                <span>
                    {icon}
                </span>
              </span>

            ) : (
              <span
                className="text-sm font-semibold text-primary bg-white rounded-lg w-20 py-2 text-center flex justify-around items-center"
              >
                <ShoppingCart size={5}/>
                <span>
                    {count} {count > 1 ? "Items" : "Item"}
                </span>
              </span>
            )
          }

            <span className="flex gap-2 items-center">
                <span className="text-lg font-semibold text-white">{label}</span>
                <span className="relative h-5 w-7">
                  <Image src={'/Icons/arrow1.svg'} alt={'icon'} fill priority/>
                </span>
              </span>
        </Button>
    );
};

export default CustomButton;
