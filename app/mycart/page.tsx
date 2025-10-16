'use client'

import React, {useCallback, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import Loader from "@/components/common-ui/Loader";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";
import OrderSummaryCard from "@/components/mycart/OrderSummaryCard";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";
import { motion } from "motion/react";

function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [cookingRequest, setCookingRequest] = useState('');

    return (
        <div className={'bg-gray-200 min-h-[100vh]'}>
            {
                isLoading ? <Loader/> : (
                    <>
                      <motion.div
                        className={'fixed w-full top-0 z-99'}
                      >
                        <TopBar title={'My Cart'}/>
                      </motion.div>

                        <div className={'pt-16 px-2'}>
                          <RestaurantInfoCard/>
                        </div>

                        <div className={'mt-4 pb-80 px-2'}>
                          <CartSummaryCard setCookingRequest={setCookingRequest} cookingRequest={cookingRequest}/>
                        </div>

                      <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                          className={'fixed bottom-0 w-full'}>
                          <OrderSummaryCard cookingRequest={cookingRequest}/>
                        </motion.div>
                    </>
                )
            }
        </div>
    );
}

export default Page;
