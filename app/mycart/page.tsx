'use client'

import React, {useCallback, useEffect, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import Loader from "@/components/common-ui/Loader";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";
import OrderSummaryCard from "@/components/mycart/OrderSummaryCard";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";
import { motion } from "motion/react";
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import {useGetOrderListQuery} from "@/lib/api/CustomerApi";
import {PastOrderCartItemCard} from "@/components/pastorder-ui/PastOrderCartItemCard";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";

function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const {orderNote} = useSelector((state: RootState) => state.menuCategory);
    const [cookingRequest, setCookingRequest] = useState(orderNote || '' );
    const searchParams = useSearchParams();
    const outletId = searchParams.get("outletId");
    const { data: orderList, isLoading: loading } = useGetOrderListQuery(
      { outletId },
      { skip: !outletId, refetchOnMountOrArgChange: true, },
    );
    const billData = orderList?.items[0];
    const [show,setShow]=useState<boolean>(false);

    const toggleTotalCart = ()=> {
      setShow(!show);
    }

    return (
        <motion.div
          className={'bg-gray-200 min-h-[100vh]'}
        >
            {
                isLoading ? (
                  <div className={'w-full animate-pulse'}>
                    <Image
                      src={'/shimmer/mycart-shimmer.svg'}
                      alt={'shimmer'}
                      width={'100'}
                      height={'100'}
                      priority
                      className='w-full h-full'
                    />
                  </div>
                  ) : (
                    <>
                      <motion.div
                        className={'fixed w-full top-0 z-99'}
                      >
                        <TopBar title={'My Cart'}/>
                      </motion.div>

                        <motion.div
                          initial={{ y: '-100%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <div className={'pt-16'}>
                            <RestaurantInfoCard/>
                          </div>

                          <div className={`mt-2 ${show ? 'pb-80' : 'pb-54'} px-2 flex flex-col gap-2`}>
                            <div className={'flex flex-col gap-2'}>
                              <span className={'font-bold pl-1 text-gray-600'}>Current Order</span>
                              <CartSummaryCard setCookingRequest={setCookingRequest} cookingRequest={cookingRequest}/>
                            </div>

                            {
                              (orderList || [])?.items?.length > 0 && (
                                <div className={'flex flex-col gap-2'}>
                                  <span className={'font-bold pl-1 text-gray-600'}>Recent Order</span>
                                  {
                                    (orderList || [])?.items?.map((item) => (
                                      <PastOrderCartItemCard data={item} key={item?.id} showBill={false}/>
                                    ))
                                  }
                                </div>
                              )
                            }
                          </div>

                          <div
                            className={'fixed bottom-0 w-full'}>
                            <OrderSummaryCard cookingRequest={cookingRequest} billData={billData} toggleTotalCart={toggleTotalCart} show={show}/>
                          </div>
                        </motion.div>
                    </>
                )
            }
        </motion.div>
    );
}

export default Page;
