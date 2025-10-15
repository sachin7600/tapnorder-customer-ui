'use client'

import {ArrowRight, Wallet} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function OrderSummaryCard() {
    const router = useRouter();
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-sm mx-auto">
            {/* Header */}
            <h2 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
                <span className="border-b-2 border-primary pb-1">Order Summary</span>
            </h2>

            {/* Summary rows */}
            <div className="flex flex-col gap-2 text-sm text-gray-700">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹ 550</span>
                </div>
                <div className="flex justify-between text-gray-500">
          <span>
            SGST <span className="text-[11px]">(2%)</span>
          </span>
                    <span>₹ 50</span>
                </div>
                <div className="flex justify-between text-gray-500">
          <span>
            CGST <span className="text-[11px]">(2%)</span>
          </span>
                    <span>₹ 50</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-3"></div>

            {/* Total */}
            <div className="flex justify-between items-center text-base font-semibold text-gray-800">
                <span>Total Amount</span>
                <span className="text-lg">₹ 650</span>
            </div>

            {/* Place Order Button */}
            <Button
                onClick={() => router.push('/pastorder')}
                className="w-full mt-4 bg-[#0B6B56] hover:bg-[#085F4C] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                <Wallet size={18}/>
                Place Order
                <ArrowRight size={18}/>
            </Button>
        </div>
    );
}
