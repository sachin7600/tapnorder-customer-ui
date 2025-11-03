'use client'

import {useRouter, useSearchParams} from "next/navigation";
import CustomButton from "@/components/common-ui/CustomButton";
import {
  useGetExistingCartIdQuery,
  usePostOrderPlacedMutation
} from "@/lib/api/CustomerApi";
import {useCallback, useState} from "react";
import {useUser} from "@/components/context/AuthContext";
import {ArrowDown, ArrowUp, ChevronDown, ChevronUp, CookingPot} from "lucide-react";
import {setOrderNote} from "@/lib/redux/slices/menuCategorySlice";
import {useDispatch} from "react-redux";
import {AnimatePresence, motion} from "motion/react";
import {number} from "yup";

type BillData = {
  totalAmount: number;
  subTotal: number;
  total: number;
  cGst: number;
  sGst: number;
  notes: string;
}

interface OrderSummaryProps {
  cookingRequest?: string;
  billData: BillData;
  showOrderBtn? : boolean;
  show?: boolean;
  toggleTotalCart?: () => void;
}

export default function OrderSummaryCard({cookingRequest="", billData, showOrderBtn=true, show, toggleTotalCart}: OrderSummaryProps) {
  const router = useRouter();
  const {user} = useUser();
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");
  const tableId = searchParams.get("tableId");
  const [postOrderPlaced, {isLoading: postOrderLoader}] = usePostOrderPlacedMutation();
  const { data: cartData, isLoading: cartLoader, refetch: refetchCart } = useGetExistingCartIdQuery({ userId: user?.id }, { skip: !user?.id });
  const dispatch= useDispatch();

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
        dispatch(setOrderNote(''));
        return router.back();
      }

    } catch (e) {
      console.log(e);
    }
  }, [cookingRequest, outletId, tableId]);

    return (
      <>
        {
          showOrderBtn ? (
            <div className="bg-white rounded-t-4xl shadow-xl p-4 w-full mx-auto">
              {/* Header */}
              <h2 className="text-sm font-semibold text-gray-800 border-gray-200 pb-1 mb-3 flex justify-between">
                <span className="border-b-1 border-primary pb-1 font-semibold text-lg">Order Summary</span>
                <span onClick={toggleTotalCart}>
                  {
                    show ? <ChevronDown /> : <ChevronUp />
                  }
                </span>
              </h2>

              {/* Summary rows */}
              <AnimatePresence>
                {
                  show && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="flex flex-col gap-2 text-sm text-gray-700 text-md font-semibold">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Subtotal</span>
                        <span className="font-medium">₹ {cartData?.subtotal + (billData?.subTotal || 0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                          <span>
                            SGST <span className="text-[11px]">({cartData?.sGstPercent}%)</span>
                          </span>
                                <span>₹ {cartData?.sgst + (billData?.sGst || 0)}</span>
                              </div>
                              <div className="flex justify-between text-gray-700">
                          <span>
                            CGST <span className="text-[11px]">({cartData?.cGstPercent}%)</span>
                          </span>
                        <span>₹ {cartData?.cgst + (billData?.cGst || 0)}</span>
                      </div>
                    </motion.div>
                  )
                }
              </AnimatePresence>

              {/* Divider */}
              <div className="border-t border-gray-300 my-3"></div>

              {/* Total */}
              <div className="flex justify-between items-center text-gray-800 bg-muted rounded-md p-1 px-2 mb-4 text-xl font-bold">
                <span className={'text-lg'}>Total Amount</span>
                <span className="text-lg">₹ {cartData?.totalAmount + (billData?.totalAmount || 0)}</span>
              </div>

              {/* Place Order Button */}
              {
                cartData?.items?.length > 0 && (
                  <CustomButton onClick={handleCartNavigate} label={'Place Order'} classNames={'py-6'} icon={<CookingPot/>} disabled={postOrderLoader}/>
                )
              }
            </div>
          ) : (
            <div className="bg-white w-full mx-auto pt-2">
              {/* Header */}
              <h2 className="text-sm font-semibold text-gray-800 border-gray-200 pb-1 mb-3">
                <span className="border-b-1 border-primary pb-1 font-semibold text-lg">Order Summary</span>
              </h2>

              {/* Summary rows */}
              <div className="flex flex-col gap-2 text-sm text-gray-700 text-md font-semibold">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span className="font-medium">₹ {billData?.subTotal || 0}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                <span>
                  SGST <span className="text-[11px]">({cartData?.sGstPercent}%)</span>
                </span>
                  <span>₹ {billData?.sGst || 0}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                <span>
                  CGST <span className="text-[11px]">({cartData?.cGstPercent}%)</span>
                </span>
                  <span>₹ {billData?.cGst || 0}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 my-3"></div>

              {/* Total */}
              <div className="flex justify-between items-center text-gray-800 bg-muted rounded-md p-1 px-2 text-xl font-bold">
                <span className={'text-lg'}>Total Amount</span>
                <span className="text-lg">₹ {billData?.totalAmount || 0}</span>
              </div>

              <div className="mt-3">
                <textarea
                  disabled={true}
                  value={billData?.notes || ""}
                  id="note"
                  placeholder="Order cooking note..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )
        }
      </>
    );
}
