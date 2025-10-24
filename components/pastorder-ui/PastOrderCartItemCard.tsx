import React from 'react';
import {Button} from "@/components/ui/button";
import {Clock1, Minus, NotebookPen, Plus} from "lucide-react";
import Image from "next/image";
import {createImageBlob} from "@/lib/createImageBlob";

export function PastOrderCartItemCard({data}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between item-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">
          Order #{data?.id}
        </h2>

        <span className={'font-semibold text-gray-600 flex items-center justify-center gap-1 text-sm'}>
               <span>
                 <Clock1 size={15} className={'text-gray-400 bg-primary rounded-full text-white'} />
               </span>
               <span>
                 {data?.createdAt
                   ? new Date(data.createdAt).toLocaleString("en-US", {
                     month: "short",
                     day: "numeric",
                     hour: "numeric",
                     minute: "2-digit",
                     hour12: true,
                   })
                   : ""}
               </span>
             </span>
      </div>

      {/* Items */}
      <div className="flex flex-col border rounded-lg">
        {data?.orderItems?.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-2 px-3 border-b-1 [&:nth-last-child(1)]:border-b-0`}
          >
            {/* Image + Details */}
            <div className="flex items-center gap-3 h-full w-full">
              <div className="relative w-14 h-12 rounded-lg overflow-hidden border">
                <Image
                  src={createImageBlob(item?.image?.url)}
                  alt={item.itemName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className={'flex justify-between w-full'}>
                  <span className="font-bold text-gray-800 text-md">
                    {item.itemName}
                  </span>
                  <span className={'text-md font-semibold text-gray-600 flex items-center justify-center'}>
                    {item?.quantity} Qty
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-700">
                  ₹{item.unitPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={'h-[0.1] w-full border-ring mt-3 border-dashed border'}>

      </div>

      {/* Whole order note */}
      <div className="mt-3">
       <div className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center bg-muted">
         <span className={'text-lg font-semibold text-gray-600'}>Total Items ({data?.totalQuantity})</span>
         <span className={'text-lg font-semibold'}>
           <span className={'font-bold text-gray-700'}>Total Amount : </span>
           <span>₹ {data?.totalAmount}</span>
         </span>
       </div>
      </div>
    </div>
  );
}


