'use client'
import React, {useState} from 'react';
import Loader from "@/components/common-ui/Loader";
import TopBar from "@/components/dashboard-ui/TopBar";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";
import {PastOrderCartItemCard} from "@/components/pastorder-ui/PastOrderCartItemCard";
import {useSearchParams} from "next/navigation";
import {useGetOrderListQuery} from "@/lib/api/CustomerApi";
import { motion } from "motion/react";
import Image from "next/image";

function Page() {
    const searchParams = useSearchParams();
    const outletId = searchParams.get("outletId");

    const { data: orderList, isLoading: loading } = useGetOrderListQuery(
      { outletId },
      { skip: !outletId, refetchOnMountOrArgChange: true, },
    );

    return (
        <motion.div
          className={'bg-gray-200 min-h-[100vh]'}>
            {
              loading ? <div className={'w-full animate-pulse'}>
                <Image
                  src={'/shimmer/pastorder-shimmer.svg'}
                  alt={'shimmer'}
                  width={'100'}
                  height={'100'}
                  priority
                  className='w-full h-full'
                />
              </div> : (
                    <>
                      <div className={'fixed w-full top-0 z-99'}>
                        <TopBar title={'Past Orders'}/>
                      </div>
                        <motion.div
                          // initial={{ y: '-100%', opacity: 0 }}
                          // animate={{ y: '0%', opacity: 1 }}
                          // transition={{ duration: 0.8, ease: "easeOut" }}
                          className={'px-2 flex flex-col gap-3'}>
                          <div className={'mt-16 px-2'}>
                            <RestaurantInfoCard/>
                          </div>
                          {
                            (orderList || [])?.items?.map((item) => (
                              <PastOrderCartItemCard data={item} key={item?.id}/>
                            ))
                          }
                        </motion.div>
                    </>
                )
            }
        </motion.div>
    );
}

export default Page;
