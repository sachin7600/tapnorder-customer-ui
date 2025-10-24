'use client'

import React, {useCallback, useEffect, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import Loader from "@/components/common-ui/Loader";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";
import OrderSummaryCard from "@/components/mycart/OrderSummaryCard";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";
import { motion } from "motion/react";
import Image from "next/image";

function Page() {
    const [isLoading, setIsLoading] = useState(true);
    const [cookingRequest, setCookingRequest] = useState('');

  useEffect(() => {
    const timerId= setTimeout(()=> {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timerId);
  }, []);

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
                          <div className={'pt-16 px-2'}>
                            <RestaurantInfoCard/>
                          </div>

                          <div className={'mt-4 pb-80 px-2'}>
                            <CartSummaryCard setCookingRequest={setCookingRequest} cookingRequest={cookingRequest}/>
                          </div>

                          <div
                            className={'fixed bottom-0 w-full'}>
                            <OrderSummaryCard cookingRequest={cookingRequest}/>
                          </div>
                        </motion.div>
                    </>
                )
            }
        </motion.div>
    );
}

export default Page;
