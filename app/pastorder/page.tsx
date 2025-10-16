'use client'
import React, {useState} from 'react';
import Loader from "@/components/common-ui/Loader";
import TopBar from "@/components/dashboard-ui/TopBar";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";
import {PastOrderCartItemCard} from "@/components/pastorder-ui/PastOrderCartItemCard";
import {useSearchParams} from "next/navigation";
import {useGetOrderListQuery} from "@/lib/api/CustomerApi";

function Page() {
    const searchParams = useSearchParams();
    const outletId = searchParams.get("outletId");

    const { data: orderList, isLoading: loading } = useGetOrderListQuery(
      { outletId },
      { skip: !outletId, refetchOnMountOrArgChange: true, },
    );

    return (
        <div className={'bg-gray-200 min-h-[100vh]'}>
            {
              loading ? <Loader/> : (
                    <>
                      <div className={'fixed w-full top-0 z-99'}>
                        <TopBar title={'Past Orders'}/>
                      </div>
                        <div className={'px-2 flex flex-col gap-3'}>
                          <div className={'mt-16 px-2'}>
                            <RestaurantInfoCard/>
                          </div>
                          {
                            orderList?.items.map((item, index) => (
                              <PastOrderCartItemCard data={item}/>
                            ))
                          }
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default Page;
