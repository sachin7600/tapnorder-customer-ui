'use client'

import {useRouter, useSearchParams} from "next/navigation";
import CustomButton from "@/components/common-ui/CustomButton";
import {
  useGetExistingCartIdQuery,
  usePostOrderPlacedMutation
} from "@/lib/api/CustomerApi";
import {useCallback} from "react";
import {useUser} from "@/components/context/AuthContext";
import {CookingPot} from "lucide-react";

export default function OrderSummaryCard({cookingRequest}) {
  const router = useRouter();
  const {user} = useUser();
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");
  const tableId = searchParams.get("tableId");
  const [postOrderPlaced, {isLoading: postOrderLoader}] = usePostOrderPlacedMutation();
  const { data: cartData, isLoading: cartLoader, refetch: refetchCart } = useGetExistingCartIdQuery({ userId: user?.id }, { skip: !user?.id });
  console.log({
    cartData
  })

  const handleCartNavigate = useCallback(async () => {
    try {
      const payload = {
        outletId: outletId,
        tableId: tableId,
        notes: cookingRequest,
        userId: Number(user?.id),
      };

      const resp = await postOrderPlaced(payload).unwrap();
      if (resp.succeeded) {
        return router.back();
      }

    } catch (e) {
      console.log(e);
    }
  }, [cookingRequest, outletId, tableId]);

    return (
        <div className="bg-white rounded-t-4xl shadow-xl p-4 w-full mx-auto">
            {/* Header */}
            <h2 className="text-sm font-semibold text-gray-800 border-gray-200 pb-1 mb-3">
                <span className="border-b-1 border-primary pb-1 font-semibold text-lg">Order Summary</span>
            </h2>

            {/* Summary rows */}
            <div className="flex flex-col gap-2 text-sm text-gray-700 text-md font-semibold">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Subtotal</span>
                    <span className="font-medium">₹ {cartData?.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                <span>
                  SGST <span className="text-[11px]">(5%)</span>
                </span>
                          <span>₹ {cartData?.sgst}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                <span>
                  CGST <span className="text-[11px]">(5%)</span>
                </span>
                          <span>₹ {cartData?.cgst}</span>
                      </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-3"></div>

            {/* Total */}
            <div className="flex justify-between items-center text-gray-800 bg-muted rounded-md p-1 px-2 mb-4 text-xl font-bold">
                <span className={'text-lg'}>Total Amount</span>
                <span className="text-lg">₹ {cartData?.totalAmount}</span>
            </div>

            {/* Place Order Button */}
            <CustomButton onClick={handleCartNavigate} label={'Place Order'} classNames={'py-6'} icon={<CookingPot/>} disabled={postOrderLoader}/>
        </div>
    );
}
